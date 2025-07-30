// src/types/contract.ts

export interface Clause {
  id: string;
  originalText: string;
  simplifiedText: string; // Now used for a placeholder text as summarization is removed
  riskLevel: 'low' | 'medium' | 'high';
  riskType: string; // e.g., "auto_renewal, penalty"
  confidence: number; // For benchmarking similarity
  explanation: string; // Added to store the risk explanation from backend
}

export interface Contract {
  id: string;
  name: string;
  uploadDate: Date;
  fileType: string;
  clauses: Clause[];
  overallRisk: 'low' | 'medium' | 'high';
  summary: string; // Overall contract summary (now a generated string)
  totalClauses: number;
  highRiskClauses: number;
}