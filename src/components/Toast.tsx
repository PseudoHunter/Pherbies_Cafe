import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-[#F0FDF4]',
    info: 'border-amber-200 bg-[#FFFBEB]',
    error: 'border-rose-200 bg-[#FFF1F2]',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-sm font-medium text-[#3D2619] ${
          borderColors[toast.type]
        }`}
      >
        {icons[toast.type]}
        <p className="flex-1 leading-snug">{toast.message}</p>
      </div>
    </div>
  );
};
