import { useState } from 'react';
import { BackButton } from '@/components/ui/BackButton';
import type { Asu } from '@/types';
import { ChevronRight, Loader2 } from 'lucide-react';

interface SelectAsuProps {
  asus: Asu[];
  loading: boolean;
  onBack: () => void;
  onSelect: (asu: Asu) => void;
}

export function SelectAsu({ asus, loading, onBack, onSelect }: SelectAsuProps) {
  const [selectedId, setSelectedId] = useState('');

  const selected = asus.find((a) => a.id === selectedId);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BackButton onClick={onBack} label="В главное меню" />
      <h2 className="text-xl font-bold text-slate-800 mb-1">Список активных АСУ</h2>
      <p className="text-sm text-slate-500 mb-6">Выберите установку для продолжения работы</p>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : asus.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-base">Нет зарегистрированных АСУ</p>
          <p className="text-sm mt-1">Создайте новый АСУ в главном меню</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            {asus.map((asu) => (
              <button
                key={asu.id}
                onClick={() => setSelectedId(asu.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all text-left ${
                  selectedId === asu.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-800">{asu.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(asu.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className={selectedId === asu.id ? 'text-blue-500' : 'text-slate-300'}
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            Открыть выбранный АСУ
          </button>
        </>
      )}
    </div>
  );
}
