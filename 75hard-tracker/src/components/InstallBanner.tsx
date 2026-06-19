import { Download, X } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface Props {
  onInstall: () => void;
  onDismiss: () => void;
}

export default function InstallBanner({ onInstall, onDismiss }: Props) {
  return (
    <div className="animate-slide-up fixed top-0 inset-x-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-3 shadow-lg">
      <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
        <Download size={18} className="text-orange-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight">Add to Home Screen</p>
        <p className="text-gray-500 text-xs">Install for the best mobile experience</p>
      </div>
      <button
        onClick={() => { haptic(); onInstall(); }}
        className="shrink-0 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
      >
        Install
      </button>
      <button
        onClick={() => { haptic(); onDismiss(); }}
        className="shrink-0 text-gray-600 hover:text-gray-400 p-1"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
