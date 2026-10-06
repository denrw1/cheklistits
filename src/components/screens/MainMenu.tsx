import { Plus, FolderSearch } from 'lucide-react';

interface MainMenuProps {
  onCreateNew: () => void;
  onSelectExisting: () => void;
}

export function MainMenu({ onCreateNew, onSelectExisting }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <span className="text-white font-bold text-xl">АСУ</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Контроль агрегатов АСУ</h1>
          <p className="text-sm text-slate-500 mt-2">Система инспекции установок</p>
        </div>

        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all"
        >
          <Plus size={22} />
          Создать новый АСУ
        </button>
        <button
          onClick={onSelectExisting}
          className="w-full flex items-center justify-center gap-2 py-4 mt-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 active:scale-[0.99] transition-all"
        >
          <FolderSearch size={22} />
          Выбрать имеющийся АСУ
        </button>
      </div>
    </div>
  );
}
