// src/components/FileUpload.tsx

import React, { useState } from 'react';
import { Contract } from '../types/contract';

interface FileUploadProps {
  onContractAnalyzed: (contract: Contract) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onContractAnalyzed }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('contract', file); // Ensure this field name is 'contract'

    try {
      const res = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Upload failed');
      } else {
        // If analysis is successful, pass the contract data to the parent component
        onContractAnalyzed(data);
      }
    } catch (err: any) {
      console.error('Error during file upload or analysis:', err);
      setError(err.message || 'An unexpected error occurred during upload or analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Contract for Analysis</h2>
      <p className="text-gray-600 mb-6">Select a PDF or text file to begin the AI-powered analysis.</p>

      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-blue-400 transition-colors">
        <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v7" />
          </svg>
          <span className="text-lg font-medium text-gray-700">Drag and drop your file here, or <span className="text-blue-600 hover:underline">browse</span></span>
          <input id="file-upload" type="file" onChange={handleUpload} className="hidden" accept=".pdf,.txt" disabled={loading} />
        </label>
      </div>

      {loading && <p className="mt-4 text-blue-600">Analyzing contract, please wait...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
    </div>
  );
};