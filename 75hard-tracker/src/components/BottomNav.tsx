import { CalendarDays, Camera, Flame } from 'lucide-react';
import { haptic } from '../utils/haptics';

export type Tab = 'today' | 'calendar' | 'photos';

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const tabs: { id: Tab; label: string; Icon: typeof Flame }[] = [
  { id: 'today',    label: 'Today',    Icon: Flame },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { id: 'photos',   label: 'Photos',   Icon: Camera },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 flex safe-bottom z-50">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => { haptic('light'); onChange(id); }}
            className={`flex-1 flex flex-col items-center gap-1 pt-3 pb-2 text-xs font-medium transition-colors
              ${isActive ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
