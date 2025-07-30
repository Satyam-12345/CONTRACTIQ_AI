// src/components/ContractAnalysis.tsx

import React from 'react';
import { Contract, Clause } from '../types/contract';

interface ContractAnalysisProps {
  contract: Contract;
}

export const ContractAnalysis: React.FC<ContractAnalysisProps> = ({ contract }) => {
  if (!contract) {
    return (
      <div className="text-red-500 p-4 bg-white rounded-lg shadow-md">
        Error: No contract data provided for analysis.
      </div>
    );
  }

  const { name, uploadDate, overallRisk, clauses, summary, totalClauses, highRiskClauses } = contract;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{name || 'Contract Analysis'}</h2>
      <p className="text-gray-600 mb-2">Uploaded on: {uploadDate ? new Date(uploadDate).toLocaleDateString() : 'N/A'}</p>
      <p className="text-gray-600 mb-4">Overall Risk: <span className={`font-semibold ${overallRisk === 'high' ? 'text-red-500' : overallRisk === 'medium' ? 'text-orange-500' : 'text-green-500'}`}>{overallRisk.toUpperCase()}</span></p>
      
      <p className="text-gray-700 mb-6">{summary || 'No overall summary available for this contract.'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg text-blue-700">Total Clauses</h3>
          <p className="text-2xl font-bold text-blue-900">{totalClauses}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg text-red-700">High Risk Clauses</h3>
          <p className="text-2xl font-bold text-red-900">{highRiskClauses}</p>
        </div>
        {/* You can add more metrics here like medium/low risk count */}
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Clause-by-Clause Analysis</h3>
      {clauses && clauses.length > 0 ? (
        <div className="space-y-6">
          {clauses.map((clause: Clause) => (
            <div key={clause.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-lg text-gray-900 mb-2">Original Clause:</h4>
              <p className="text-gray-800 mb-2 whitespace-pre-wrap">{clause.originalText || 'N/A'}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-700">Risk Level:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-semibold 
                  ${clause.riskLevel === 'high' ? 'bg-red-100 text-red-800' : 
                     clause.riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' : 
                     'bg-green-100 text-green-800'}`}>
                  {clause.riskLevel ? clause.riskLevel.toUpperCase() : 'UNKNOWN'}
                </span>
                <span className="font-semibold text-gray-700 ml-4">Risk Types:</span>
                <span className="text-gray-800 text-sm">{clause.riskType || 'None detected'}</span>
              </div>
              
              <p className="text-gray-700 mb-2"><span className="font-semibold">Explanation:</span> {clause.explanation || 'No explanation available.'}</p>
              <p className="text-gray-700"><span className="font-semibold">Similarity:</span> {clause.confidence}%</p>
              {/* Simplified text is now just a placeholder */}
              <p className="text-gray-500 text-sm mt-2 italic">{clause.simplifiedText}</p> 
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600 p-4 bg-yellow-50 rounded-lg">
          No clauses found or analyzed for this contract.
        </div>
      )}
    </div>
  );
};