import { BackButton } from '@/components/ui/BackButton';
import { NODES_STRUCTURE } from '@/data/nodeStructure';
import { Camera, CheckCircle2, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { NodePhoto } from '@/types';

interface NodesScreenProps {
  containerName: string;
  photosByNode: Record<string, NodePhoto[]>;
  photoBaseUrl: (storagePath: string) => string;
  onBack: () => void;
  onCaptureNode: (nodeName: string) => void;
  onDeletePhoto: (photoId: string, storagePath: string) => Promise<boolean>;
}

export function NodesScreen({
  containerName,
  photosByNode,
  photoBaseUrl,
  onBack,
  onCaptureNode,
  onDeletePhoto,
}: NodesScreenProps) {
  const nodes = NODES_STRUCTURE[containerName] ?? [];
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (photoId: string, storagePath: string) => {
    setDeletingId(photoId);
    await onDeletePhoto(photoId, storagePath);
    setDeletingId(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <BackButton onClick={onBack} label="К контейнерам" />
      <h2 className="text-xl font-bold text-slate-800 mb-1">{containerName}</h2>
      <p className="text-sm text-slate-500 mb-6">
        Зелёным отмечены зафиксированные узлы. Нажмите на узел, чтобы сделать снимок.
      </p>

      <div className="space-y-2 pb-8">
        {nodes.map((node) => {
          const key = `${containerName}|||${node}`;
          const photos = photosByNode[key] ?? [];
          const hasPhotos = photos.length > 0;
          const isOpen = expandedNode === node;

          return (
            <div key={node}>
              <div
                className={`flex items-center gap-3 px-5 py-4 rounded-xl border-l-[6px] transition-all cursor-pointer ${
                  hasPhotos
                    ? 'border-l-emerald-500 bg-emerald-50'
                    : 'border-l-slate-300 bg-white hover:bg-slate-50'
                }`}
                onClick={() => setExpandedNode(isOpen ? null : node)}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    hasPhotos ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {hasPhotos ? <CheckCircle2 size={22} /> : <Camera size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold ${hasPhotos ? 'text-emerald-800' : 'text-slate-800'}`}
                  >
                    {node}
                  </p>
                  <p className={`text-xs mt-0.5 ${hasPhotos ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {photos.length > 0
                      ? `${photos.length} снимок(ов)`
                      : 'Не сфотографировано'}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className={`text-slate-300 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
              </div>

              {isOpen && (
                <div className="mt-1 mb-2 ml-2 p-4 bg-slate-50 rounded-xl space-y-3">
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photoBaseUrl(photo.storage_path)}
                            alt={node}
                            className="w-full h-32 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-mono truncate">
                              {photo.filename}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(photo.id, photo.storage_path);
                              }}
                              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors p-1"
                            >
                              {deletingId === photo.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCaptureNode(node);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all text-sm"
                  >
                    <Camera size={18} />
                    {hasPhotos ? 'Добавить снимок' : 'Сделать снимок'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
