// src/App.tsx

import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ContractAnalysis } from './components/ContractAnalysis';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar'; // FIXED: Changed '=>' to 'from'
import { Contract, Clause } from './types/contract'; // Ensure Contract and Clause types are imported

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload' | 'analysis'>('dashboard');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const handleContractAnalyzed = (responseData: any) => {
    if (responseData && responseData.success) {
      const mappedClauses: Clause[] = (responseData.clauses || []).map((flaskClause: any, index: number) => {
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        // Ensure flaskClause.risks is an array, default to empty array if null/undefined
        const riskTypesDetected = Array.isArray(flaskClause.risks) ? flaskClause.risks : [];

        if (riskTypesDetected.length === 0) {
          riskLevel = 'low';
        } else {
          const highRiskKeywords = ['auto_renewal', 'penalty', 'liability'];
          const mediumRiskKeywords = ['termination'];

          const hasHighRisk = highRiskKeywords.some(keyword => riskTypesDetected.includes(keyword));
          const hasMediumRisk = mediumRiskKeywords.some(keyword => riskTypesDetected.includes(keyword));

          if (hasHighRisk) {
            riskLevel = 'high';
          } else if (hasMediumRisk) {
            riskLevel = 'medium';
          } else {
            // Default any other detected risks to 'medium' if not explicitly high
            riskLevel = 'medium';
          }

          // If multiple diverse risk types are present, promote to 'high' if not already
          if (riskTypesDetected.length > 1 && riskLevel !== 'high') {
            riskLevel = 'high';
          }
        }

        const riskType = riskTypesDetected.length > 0 ? riskTypesDetected.join(', ') : 'No Risk Detected';

        // Ensure explanation is a string
        let explanationText = 'No detailed explanation provided.';
        if (flaskClause.explanation) {
            if (Array.isArray(flaskClause.explanation)) {
                explanationText = flaskClause.explanation.join(' ');
            } else if (typeof flaskClause.explanation === 'string') {
                explanationText = flaskClause.explanation;
            }
        }

        return {
          id: `clause-${index}-${Date.now()}`,
          originalText: flaskClause.original || 'N/A', // Defensive check
          simplifiedText: 'No summary provided (risk analysis only).',
          riskLevel: riskLevel,
          riskType: riskType,
          confidence: flaskClause.similarity ? Math.round(flaskClause.similarity * 100) : 0,
          explanation: explanationText, // Map the explanation
        };
      });

      const contractData: Contract = {
        id: `contract-${Date.now()}`,
        name: responseData.filename || 'Unknown Contract',
        uploadDate: new Date(responseData.uploadDate),
        fileType: responseData.filename.toLowerCase().endsWith('.pdf') ? 'PDF' : 'TXT',
        clauses: mappedClauses, // This should always be an array due to (responseData.clauses || [])
        overallRisk: responseData.overallRisk || 'low',
        summary: `Analyzed contract with ${mappedClauses.length} clauses. Overall risk detected: ${responseData.overallRisk}. Note: Summarization is disabled.`,
        totalClauses: mappedClauses.length,
        highRiskClauses: mappedClauses.filter(c => c.riskLevel === 'high').length,
      };

      setSelectedContract(contractData);
      setCurrentView('analysis');
    } else {
      console.error("Analysis failed or response data is incomplete:", responseData);
    }
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setCurrentView('analysis');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="flex">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 p-6">
          {currentView === 'dashboard' && (
            <Dashboard onViewContract={handleViewContract} />
          )}
          {currentView === 'upload' && (
            <FileUpload onContractAnalyzed={handleContractAnalyzed} />
          )}
          {currentView === 'analysis' && selectedContract && (
            <ContractAnalysis contract={selectedContract} />
          )}
          {currentView === 'analysis' && !selectedContract && (
            <div className="text-red-500">No contract data available for analysis. Please upload a contract first.</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;