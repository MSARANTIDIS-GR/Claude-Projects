import { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { useChallenge } from '../store/useChallenge';
import { formatDate } from '../utils/dates';
import type { DayRecord } from '../types';

type ChallengeHook = ReturnType<typeof useChallenge>;
interface Props { challenge: ChallengeHook; }

export default function PhotosScreen({ challenge }: Props) {
  const { state } = challenge;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const photos: (DayRecord & { dayNum: number })[] = Object.values(state.days)
    .filter(d => d.photoTaken && d.photoData)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(d => {
      const startDate = state.challengeStartDate ?? d.date;
      const startMs = new Date(startDate + 'T00:00:00').getTime();
      const dateMs  = new Date(d.date   + 'T00:00:00').getTime();
      const dayNum  = Math.round((dateMs - startMs) / 86_400_000) + 1;
      return { ...d, dayNum };
    });

  function closeLightbox() { setLightboxIdx(null); }
  function prev() { setLightboxIdx(i => (i !== null && i < photos.length - 1 ? i + 1 : i)); }
  function next() { setLightboxIdx(i => (i !== null && i > 0 ? i - 1 : i)); }

  const active = lightboxIdx !== null ? photos[lightboxIdx] : null;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-5">
      <div>
        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Journey</p>
        <h2 className="text-3xl font-black text-white mt-1">
          Progress Photos
          {photos.length > 0 && (
            <span className="text-gray-600 font-normal text-xl ml-2">({photos.length})</span>
          )}
        </h2>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
            <Image size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm">No photos yet.</p>
          <p className="text-gray-600 text-xs">Take your first progress photo on the Today screen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((d, idx) => (
            <button
              key={d.date}
              onClick={() => setLightboxIdx(idx)}
              className="text-left space-y-1 active:scale-95 transition-transform"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                <img
                  src={d.photoData!}
                  alt={`Progress photo day ${d.dayNum}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Day badge */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[11px] text-white font-bold">
                  Day {d.dayNum}
                </div>
                {d.completed && (
                  <div className="absolute top-2 right-2 bg-emerald-500/90 rounded-full w-5 h-5 flex items-center justify-center text-[10px] text-white font-bold">
                    ✓
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">{formatDate(d.date)}</p>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <div>
              <p className="text-white font-bold">Day {active.dayNum}</p>
              <p className="text-gray-400 text-xs">{formatDate(active.date)}</p>
            </div>
            <button
              onClick={closeLightbox}
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* Photo */}
          <div className="flex-1 flex items-center justify-center px-4 min-h-0">
            <img
              src={active.photoData!}
              alt={`Day ${active.dayNum} progress`}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>

          {/* Navigation */}
          {photos.length > 1 && (
            <div className="flex items-center justify-between px-4 py-4 shrink-0">
              <button
                onClick={prev}
                disabled={lightboxIdx === photos.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-sm"
              >
                <ChevronLeft size={16} /> Older
              </button>
              <span className="text-gray-600 text-xs">
                {lightboxIdx! + 1} / {photos.length}
              </span>
              <button
                onClick={next}
                disabled={lightboxIdx === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all text-sm"
              >
                Newer <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
