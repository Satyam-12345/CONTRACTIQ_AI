# server/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz  # PyMuPDF
import uuid
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load models
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
# Summarizer pipeline removed as per request
qa_pipeline = pipeline("question-answering", model="distilbert-base-cased-distilled-squad")

ner_model_name = "nlpaueb/legal-bert-base-uncased"
ner_tokenizer = AutoTokenizer.from_pretrained(ner_model_name)
ner_model = AutoModelForTokenClassification.from_pretrained(ner_model_name)
ner_pipeline = pipeline("ner", model=ner_model, tokenizer=ner_tokenizer, aggregation_strategy="simple")

RISK_PATTERNS = {
    'auto_renewal': [r'automatically renew', r'auto-renew', r'renewal.*unless.*notice'],
    'penalty': [r'liquidated damages', r'penalty.*breach'],
    'termination': [r'terminate.*agreement', r'end.*contract'],
    'liability': [r'limitation.*liability', r'not.*liable', r'exclude.*damages']
}

RISK_EXPLANATIONS = {
    'auto_renewal': 'Could lock you into unwanted renewals.',
    'penalty': 'Could result in significant financial penalties for breach.',
    'termination': 'Defines conditions under which the contract can be ended.',
    'liability': 'Limits responsibility for damages or losses.'
}


def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def is_legal_document(text):
    if not text.strip():
        return False
    legal_terms = ['agreement', 'contract', 'party', 'clause', 'whereas', 'hereto', 'indemnify', 'notwithstanding']
    if sum(text.lower().count(term) for term in legal_terms) >= 3:
        return True

    try:
        results = classifier(text[:512], candidate_labels=["legal document", "casual text", "news article"])
        if results['labels'][0] == 'legal document' and results['scores'][0] > 0.7:
            return True
    except Exception as e:
        print(f"Error during zero-shot classification: {e}")
        pass

    return False


def extract_clauses(text):
    clauses = re.split(r'\n\s*\n|\.\s*(?=[A-Z])', text)
    clauses = [clause.strip() for clause in clauses if len(clause.strip()) > 50]
    return clauses


def detect_risks(clause_text):
    detected_risks = []
    explanations = []
    # Corrected typo here: RISK_PATTERNS
    for risk_type, patterns in RISK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, clause_text, re.IGNORECASE):
                detected_risks.append(risk_type)
                # Combine explanations for multiple risks if detected for one clause
                if RISK_EXPLANATIONS.get(risk_type) not in explanations:
                    explanations.append(RISK_EXPLANATIONS.get(risk_type, f"Potential {risk_type} risk detected."))
                break

    return list(set(detected_risks)), list(set(explanations))


def benchmark_clause(clause_text):
    standard_clause = "This is a standard contractual provision with balanced terms."
    vectorizer = TfidfVectorizer().fit_transform([clause_text, standard_clause])
    similarity = cosine_similarity(vectorizer[0:1], vectorizer[1:2])[0][0]
    return similarity


def answer_question(context, question):
    try:
        result = qa_pipeline(question=question, context=context)
        return result['answer']
    except Exception as e:
        print(f"Error during QA: {e}")
        return "Sorry, I cannot answer that question based on the provided context."


@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        file = request.files['file']
        text = extract_text_from_pdf(file)
        if not is_legal_document(text):
            return jsonify({'success': False, 'error': 'Not a legal contract'}), 400

        clauses = extract_clauses(text)
        output = []
        for c in clauses[:5]:  # Process first 5 clauses for demo
            risks, explanation = detect_risks(c)
            similarity = benchmark_clause(c)
            output.append({
                'original': c,
                'risks': risks,
                'explanation': explanation,  # Include explanation in the response
                'similarity': round(similarity, 2)
            })

        return jsonify({
            'success': True,
            'filename': file.filename,
            'uploadDate': datetime.now().isoformat(),
            'overallRisk': 'high' if any(c['risks'] for c in output) else 'low',
            'clauses': output
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        answer = answer_question(data['context'], data['question'])
        return jsonify({'answer': answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 ContractIQ AI Backend starting...")
    app.run(host='0.0.0.0', port=5000, debug=True)