import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Node.js Express backend

export const contractService = {
  // This function might not be directly used if analyze is handled by FileUpload
  // but good to have a dedicated service for future API calls
  analyzeContract: async (file: File) => {
    const formData = new FormData();
    formData.append('contract', file);
    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  askChatbot: async (context: string, question: string) => {
    // Note: The chatbot endpoint is directly on the Flask server for now
    // If you want it to go through Node.js, you'd create a new endpoint in index.js
    const response = await axios.post('http://localhost:5000/chatbot', { context, question });
    return response.data.answer;
  },
};