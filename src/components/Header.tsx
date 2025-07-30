import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">ContractIQ AI</h1>
        {/* Potentially add user profile, logout, etc. */}
      </div>
    </header>
  );
};