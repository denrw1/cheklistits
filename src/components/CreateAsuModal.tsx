import { X, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreateAsuModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function CreateAsuModal({ open, onClose, onCreate }: CreateAsuModalProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setName('');
  }, [open]);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onCreate(name.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800">Регистрация нового АСУ</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={22} />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Введите название или номер установки:
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Например: АСУ 2026-002 CSM2500B"
          autoFocus
          className="w-full px-4 py-3 text-base border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            disabled={saving || !name.trim()}
            className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            ОК
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
