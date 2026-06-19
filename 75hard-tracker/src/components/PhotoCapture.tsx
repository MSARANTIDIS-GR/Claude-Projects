import { useRef } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react';

interface Props {
  taken: boolean;
  photoData: string | null;
  onChange: (taken: boolean, data: string | null) => void;
}

export default function PhotoCapture({ taken, photoData, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target?.result as string;
      onChange(true, data);
    };
    reader.readAsDataURL(file);
    // reset so the same file can be re-selected
    e.target.value = '';
  }

  return (
    <div className="space-y-3">
      {photoData && (
        <div className="relative">
          <img
            src={photoData}
            alt="Progress photo"
            className="w-full max-h-48 object-cover rounded-xl border border-gray-700"
          />
          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5">
            <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFile}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all active:scale-95
          ${taken
            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50'
            : 'bg-orange-500/20 text-orange-300 border border-orange-500/30 hover:bg-orange-500/30'
          }`}
      >
        <Camera size={20} />
        {taken ? 'Retake Photo' : 'Take Progress Photo'}
      </button>
    </div>
  );
}
