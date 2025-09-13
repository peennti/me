import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 shadow-md z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Chat Anything</h1>
          <p className="text-sm text-slate-400">Powered by Gemini API</p>
        </div>
        <div className="flex items-center">
            <p className="text-sm text-cyan-400 bg-slate-700/50 px-3 py-1.5 rounded-full border border-slate-600">
                โหมดแปลภาษาไทย 🇹🇭
            </p>
        </div>
      </div>
    </header>
  );
};

export default Header;