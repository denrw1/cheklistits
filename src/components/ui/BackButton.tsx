import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = 'Назад' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-slate-600 font-semibold text-sm mb-4 hover:text-slate-900 transition-colors"
    >
      <ChevronLeft size={20} />
      {label}
    </button>
  );
}
