import { BackButton } from '@/components/ui/BackButton';
import { CONTAINER_NAMES, NODES_STRUCTURE } from '@/data/nodeStructure';
import { ChevronRight, CheckCircle2, Package } from 'lucide-react';

interface ContainersScreenProps {
  asuName: string;
  photoCounts: Record<string, number>;
  onBack: () => void;
  onSelectContainer: (containerName: string) => void;
}

export function ContainersScreen({
  asuName,
  photoCounts,
  onBack,
  onSelectContainer,
}: ContainersScreenProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BackButton onClick={onBack} label="В меню" />
      <h2 className="text-xl font-bold text-slate-800 mb-1">{asuName}</h2>
      <p className="text-sm text-slate-500 mb-6">Выберите отсек для проведения съемки</p>

      <div className="space-y-2 pb-8">
        {CONTAINER_NAMES.map((container) => {
          const total = NODES_STRUCTURE[container].length;
          const done = photoCounts[container] ?? 0;
          const completed = done >= total;

          return (
            <button
              key={container}
              onClick={() => onSelectContainer(container)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border-l-[6px] transition-all text-left ${
                completed
                  ? 'border-l-emerald-500 bg-emerald-50'
                  : 'border-l-slate-300 bg-white hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {completed ? <CheckCircle2 size={22} /> : <Package size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold ${completed ? 'text-emerald-800' : 'text-slate-800'}`}
                >
                  {container}
                </p>
                <p className={`text-xs mt-0.5 ${completed ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {done} / {total} узлов сфотографировано
                </p>
              </div>
              <ChevronRight size={20} className={completed ? 'text-emerald-400' : 'text-slate-300'} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
