import React from 'react';

interface LoadingProps {
  fullPage?: boolean;
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullPage = false, message, className = '' }) => {
  if (fullPage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080b12]">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
          {message && <p className="text-gray-400 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center items-center h-64 bg-[#0d1117] rounded-xl border border-[#1a1f2a] ${className}`}
    >
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      {message && <p className="text-gray-400 mt-4 font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default Loading;
