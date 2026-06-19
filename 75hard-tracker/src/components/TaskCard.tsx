import type { ReactNode } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { haptic } from '../utils/haptics';

interface Props {
  done: boolean;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  onToggle?: () => void;
}

export default function TaskCard({ done, icon, title, subtitle, children, onToggle }: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300
        ${done
          ? 'bg-emerald-950/40 border-emerald-700/60'
          : 'bg-gray-900 border-gray-800'}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 transition-colors duration-300 ${done ? 'text-emerald-400' : 'text-orange-400'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className={`font-semibold text-sm transition-colors duration-300 ${done ? 'text-emerald-300' : 'text-white'}`}>
              {title}
            </span>
            {onToggle && (
              <button
                onClick={() => { haptic(done ? 'light' : 'medium'); onToggle(); }}
                className="shrink-0 active:scale-90 transition-transform"
                aria-label={done ? 'Mark incomplete' : 'Mark complete'}
              >
                {done
                  ? <CheckCircle2
                      key="done"
                      size={24}
                      className="text-emerald-400 animate-check-pop"
                      strokeWidth={2}
                    />
                  : <Circle size={24} className="text-gray-600" strokeWidth={1.5} />
                }
              </button>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
