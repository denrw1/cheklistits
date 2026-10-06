import { Check, RotateCcw, X, Loader2 } from 'lucide-react';

interface PreviewScreenProps {
  dataUrl: string;
  filename: string;
  saving: boolean;
  onSave: () => void;
  onRetake: () => void;
  onCancel: () => void;
}

export function PreviewScreen({
  dataUrl,
  filename,
  saving,
  onSave,
  onRetake,
  onCancel,
}: PreviewScreenProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Проверка качества снимка</h2>

      <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-lg">
        <img src={dataUrl} alt="Превью" className="w-full h-full object-cover" />
      </div>

      <div className="mt-3 px-3 py-2.5 bg-slate-800 rounded-lg">
        <p className="text-xs font-mono text-slate-200 break-all">{filename}</p>
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 size={22} className="animate-spin" /> : <Check size={22} />}
          {saving ? 'Сохранение...' : 'Готово'}
        </button>
        <button
          onClick={onRetake}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <RotateCcw size={20} />
          Переснять
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <X size={20} />
          Отменить съёмку
        </button>
      </div>
    </div>
  );
}
