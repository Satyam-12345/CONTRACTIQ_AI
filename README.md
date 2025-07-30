# ContractIQ AI - Intelligent Contract Analysis Platform

A comprehensive full-stack application that uses AI to analyze legal contracts, extract clauses, assess risks, and provide simplified explanations.

## 🚀 Features

- **Smart Contract Upload**: Support for PDF, TXT, DOC, and DOCX files
- **AI-Powered Analysis**: Automated clause extraction and risk assessment
- **Risk Level Detection**: Color-coded risk levels (High, Medium, Low)
- **Simplified Explanations**: AI-generated plain language explanations
- **Interactive Dashboard**: View past analyses and contract statistics
- **Downloadable Reports**: Export analysis results as JSON
- **Real-time Processing**: Live upload progress and analysis status

## 🛠 Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **Multer** for file uploads
- **CORS** for cross-origin requests
- **UUID** for unique identifiers

### AI Service
- **Python 3** with Flask
- **RegEx** for pattern matching
- **Mock AI Analysis** (easily replaceable with OpenAI API)

## 📁 Project Structure

```
contractiq-ai/
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   └── App.tsx            # Main app component
├── server/                # Node.js backend
│   ├── index.js           # Express server
│   └── uploads/           # File upload directory
├── ml_service/            # Python AI service
│   └── app.py             # Flask ML service
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Python dependencies:**
```bash
# For the ML service (if running separately)
pip install flask flask-cors
```

### Running the Application

1. **Start the frontend development server:**
```bash
npm run dev
```

2. **Start the backend server:**
```bash
npm run server
```

3. **Start the Python ML service (optional):**
```bash
cd ml_service
python app.py
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- ML Service: http://localhost:5000

## 🔧 API Endpoints

### Backend (Node.js)
- `POST /api/analyze` - Analyze uploaded contract
- `GET /api/contracts` - Get all contracts
- `GET /api/contracts/:id` - Get specific contract
- `DELETE /api/contracts/:id` - Delete contract
- `GET /api/health` - Health check

### ML Service (Python)
- `POST /analyze` - Analyze contract content
- `POST /extract-text` - Extract text from PDF
- `GET /health` - Health check

## 📊 Sample Analysis Output

```json
{
  "contract": {
    "id": "contract-123",
    "name": "Software License Agreement.pdf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "overallRisk": "high",
    "clauses": [
      {
        "id": "clause-1",
        "originalText": "This Agreement shall automatically renew...",
        "simplifiedText": "This contract automatically renews every year...",
        "riskLevel": "high",
        "riskType": "Auto-renewal",
        "confidence": 95
      }
    ],
    "totalClauses": 4,
    "highRiskClauses": 2
  }
}
```

## 🔐 Security Features

- File type validation
- File size limits (10MB)
- Temporary file cleanup
- CORS protection
- Input sanitization

## 🎨 UI/UX Features

- Responsive design for all devices
- Drag-and-drop file upload
- Real-time progress tracking
- Color-coded risk indicators
- Interactive clause details
- Professional dashboard layout

## 🔧 Customization

### Adding New Risk Patterns
Edit `ml_service/app.py` to add new risk detection patterns:

```python
self.risk_patterns = {
    'new_risk_type': [
        r'pattern1',
        r'pattern2'
    ]
}
```

### Integrating Real AI Services
Replace the mock analysis in `ml_service/app.py` with:
- OpenAI GPT API for text analysis
- spaCy for NLP processing
- PyMuPDF for PDF text extraction

## 📈 Future Enhancements

- User authentication system
- MongoDB integration
- Real OpenAI API integration
- Advanced PDF parsing
- Email notifications
- Batch processing
- Advanced analytics
- Export to multiple formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues, please open an issue on the GitHub repository.