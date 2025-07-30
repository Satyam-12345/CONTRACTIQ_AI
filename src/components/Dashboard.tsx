import React from 'react';
import { Contract } from './types/contract';

interface DashboardProps {
  onViewContract: (contract: Contract) => void;
}

// Dummy data for demonstration purposes
const dummyContracts: Contract[] = [
  {
    filename: 'Sample_Agreement_2023.pdf',
    uploadDate: '2023-10-26T10:00:00Z',
    overallRisk: 'low',
    clauses: [
      {
        original: 'This agreement shall commence on the Effective Date and continue for a period of one (1) year, automatically renewing for successive one-year terms unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.',
        summary: 'Agreement starts on Effective Date, lasts one year, auto-renews annually unless 60-day non-renewal notice is given.',
        risks: ['auto_renewal'],
        explanation: 'Could lock you into unwanted renewals.',
        similarity: 0.85,
        entities: [
          { word: 'Effective Date', entity_group: 'DATE' },
          { word: 'one (1) year', entity_group: 'DURATION' },
          { word: 'sixty (60) days', entity_group: 'DURATION' },
        ],
      },
      {
        original: 'The intellectual property rights for all work performed under this agreement shall belong exclusively to Client.',
        summary: 'Client retains all intellectual property rights for work done under this agreement.',
        risks: [],
        explanation: 'Standard clause.',
        similarity: 0.92,
        entities: [
          { word: 'intellectual property rights', entity_group: 'LEGAL_TERM' },
          { word: 'Client', entity_group: 'ORG' },
        ],
      }
    ],
  },
  {
    filename: 'Service_Contract_Q1_2024.pdf',
    uploadDate: '2024-03-15T14:30:00Z',
    overallRisk: 'high',
    clauses: [
      {
        original: 'In the event of a breach of this agreement by the Service Provider, the Service Provider shall pay to the Client liquidated damages in the amount of $5,000 for each week of delay.',
        summary: 'Service Provider must pay $5,000 weekly liquidated damages for breach of contract.',
        risks: ['penalty'],
        explanation: 'Contains financial penalties.',
        similarity: 0.78,
        entities: [
          { word: 'Service Provider', entity_group: 'ORG' },
          { word: 'Client', entity_group: 'ORG' },
          { word: '$5,000', entity_group: 'MONEY' },
          { word: 'each week', entity_group: 'DURATION' },
        ],
      },
      {
        original: 'This contract may be terminated by either party without cause upon thirty (30) days written notice.',
        summary: 'Either party can terminate with 30 days written notice without cause.',
        risks: ['termination'],
        explanation: 'Governs how contract ends.',
        similarity: 0.95,
        entities: [
          { word: 'thirty (30) days', entity_group: 'DURATION' },
        ],
      }
    ],
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ onViewContract }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">ContractIQ Dashboard</h2>

      <div className="mb-8">
        <p className="text-gray-700">Welcome to your ContractIQ AI dashboard. Here you can manage and review your analyzed contracts.</p>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Recently Analyzed Contracts</h3>
        {dummyContracts.length > 0 ? (
          <div className="space-y-4">
            {dummyContracts.map((contract) => (
              <div key={contract.filename} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{contract.filename}</p>
                  <p className="text-sm text-gray-600">Uploaded: {new Date(contract.uploadDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">
                    Overall Risk:{' '}
                    <span className={contract.overallRisk === 'high' ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                      {contract.overallRisk.toUpperCase()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onViewContract(contract)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No contracts analyzed yet. Upload one to get started!</p>
        )}
      </div>
    </div>
  );
};