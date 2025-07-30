import React from 'react';

interface SidebarProps {
  currentView: 'dashboard' | 'upload' | 'analysis';
  onViewChange: (view: 'dashboard' | 'upload' | 'analysis') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'upload', label: 'Upload Contract' },
    // 'analysis' view is typically navigated to after upload, not a direct nav link
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen p-4 shadow-lg">
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id as 'dashboard' | 'upload' | 'analysis')}
                className={`w-full text-left py-2 px-3 rounded-md transition duration-200
                  ${currentView === item.id ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-700 text-slate-300 hover:text-white'}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};