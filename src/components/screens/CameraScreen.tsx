import { useEffect } from 'react';
import { Camera, Flashlight, X, Loader2, AlertCircle } from 'lucide-react';

interface CameraScreenProps {
  title: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  error: string | null;
  isReady: boolean;
  torchOn: boolean;
  onStart: () => void;
  onStop: () => void;
  onCapture: () => void;
  onToggleTorch: () => void;
}

export function CameraScreen({
  title,
  videoRef,
  error,
  isReady,
  torchOn,
  onStart,
  onStop,
  onCapture,
  onToggleTorch,
}: CameraScreenProps) {
  useEffect(() => {
    onStart();
  }, [onStart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>

      <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden shadow-inner">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-white/70" size={32} />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <AlertCircle size={32} className="text-red-400" />
            <p className="text-white/80 text-sm text-center">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <button
          onClick={onCapture}
          disabled={!isReady}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <Camera size={22} />
          Сделать снимок
        </button>
        <button
          onClick={onToggleTorch}
          disabled={!isReady}
          className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 ${
            torchOn
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-slate-600 text-white hover:bg-slate-700'
          }`}
        >
          <Flashlight size={20} />
          {torchOn ? 'Выключить подсветку' : 'Включить подсветку'}
        </button>
        <button
          onClick={onStop}
          className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 active:scale-[0.99] transition-all"
        >
          <X size={20} />
          Отменить
        </button>
      </div>
    </div>
  );
}
