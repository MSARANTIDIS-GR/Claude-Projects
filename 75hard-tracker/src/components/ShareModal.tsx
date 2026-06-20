import { useState, useEffect } from 'react';
import { X, Share2, Download, Loader2 } from 'lucide-react';
import type { DayRecord } from '../types';
import {
  generateDayCard,
  generatePhotoCard,
  generateMilestoneCard,
  shareOrDownload,
  MILESTONE_DAYS,
} from '../utils/shareCard';
import { haptic } from '../utils/haptics';

interface Props {
  day: number;
  record: DayRecord;
  onClose: () => void;
}

type CardType = 'day' | 'photo' | 'milestone';

const TABS: { id: CardType; label: string; emoji: string }[] = [
  { id: 'day',       label: 'Day Card',   emoji: '🔥' },
  { id: 'photo',     label: 'Photo',      emoji: '📸' },
  { id: 'milestone', label: 'Milestone',  emoji: '🏆' },
];

export default function ShareModal({ day, record, onClose }: Props) {
  const [activeTab, setActiveTab]   = useState<CardType>('day');
  const [preview, setPreview]       = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [sharing, setSharing]       = useState(false);

  const isMilestone = MILESTONE_DAYS.includes(day);
  const hasPhoto    = !!(record.photoTaken && record.photoData);

  async function generate(type: CardType) {
    setGenerating(true);
    setPreview(null);
    let url: string | null = null;
    if (type === 'day')       url = await generateDayCard(day, record);
    if (type === 'photo')     url = await generatePhotoCard(day, record);
    if (type === 'milestone') url = await generateMilestoneCard(day);
    setPreview(url);
    setGenerating(false);
  }

  useEffect(() => { generate(activeTab); }, [activeTab]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function handleShare() {
    if (!preview) return;
    haptic('medium');
    setSharing(true);
    try {
      const filename = `75hard-day${day}-${activeTab}.png`;
      const text = `Day ${day} of 75 Hard! 🔥 #75Hard #MentalToughness`;
      await shareOrDownload(preview, filename, text);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg mx-auto bg-gray-900 border border-gray-700 rounded-t-3xl animate-sheet-up flex flex-col max-h-[92svh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0">
          <div>
            <h3 className="text-white font-bold text-lg">Share Progress</h3>
            <p className="text-gray-500 text-xs">Day {day} of 75</p>
          </div>
          <button
            onClick={() => { haptic(); onClose(); }}
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 shrink-0">
          <div className="flex bg-gray-800 rounded-xl p-1 gap-1">
            {TABS.map(t => {
              const disabled = (t.id === 'photo' && !hasPhoto) || (t.id === 'milestone' && !isMilestone);
              return (
                <button
                  key={t.id}
                  onClick={() => { if (!disabled) { haptic(); setActiveTab(t.id); } }}
                  disabled={disabled}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                    ${activeTab === t.id ? 'bg-orange-500 text-white' : 'text-gray-400'}
                    ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:text-white'}`}
                >
                  {t.emoji} {t.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'photo' && !hasPhoto && (
            <p className="text-xs text-gray-600 text-center mt-2">
              Take a progress photo first on the Today screen.
            </p>
          )}
          {activeTab === 'milestone' && !isMilestone && (
            <p className="text-xs text-gray-600 text-center mt-2">
              Milestone cards unlock on days 1, 7, 14, 21, 30, 45, 60, and 75.
            </p>
          )}
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col items-center gap-4">
          {generating ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 size={32} className="text-orange-400 animate-spin" />
              <p className="text-gray-500 text-sm">Generating card…</p>
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt="Card preview"
              className="w-full max-w-[280px] rounded-2xl border border-gray-700 shadow-xl"
              style={{ aspectRatio: '9/16', objectFit: 'cover' }}
            />
          ) : (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-600 text-sm">Card not available.</p>
            </div>
          )}
        </div>

        {/* Share / Download button */}
        <div className="px-5 pb-6 pt-2 shrink-0 space-y-2">
          <button
            onClick={handleShare}
            disabled={!preview || sharing}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 disabled:bg-orange-900 disabled:text-orange-700 text-white font-bold transition-all active:scale-95"
          >
            {sharing
              ? <Loader2 size={20} className="animate-spin" />
              : 'share' in navigator ? <><Share2 size={18} /> Share</> : <><Download size={18} /> Download</>
            }
          </button>
          <p className="text-center text-xs text-gray-700">
            {'share' in navigator ? "Opens your phone's share menu" : 'Saves the card as a PNG image'}
          </p>
        </div>
      </div>
    </div>
  );
}
