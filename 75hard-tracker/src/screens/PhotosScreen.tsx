import { Image } from 'lucide-react';
import type { useChallenge } from '../store/useChallenge';
import { formatDate } from '../utils/dates';

type ChallengeHook = ReturnType<typeof useChallenge>;

interface Props {
  challenge: ChallengeHook;
}

export default function PhotosScreen({ challenge }: Props) {
  const { state } = challenge;

  const photos = Object.values(state.days)
    .filter(d => d.photoTaken && d.photoData)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-4 space-y-5">
      <div>
        <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Journey</p>
        <h2 className="text-3xl font-black text-white mt-1">Progress Photos</h2>
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
          {photos.map(d => (
            <div key={d.date} className="space-y-1">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                <img
                  src={d.photoData!}
                  alt={`Progress photo day ${d.date}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {d.completed && (
                  <div className="absolute top-2 right-2 bg-emerald-500/90 rounded-full px-1.5 py-0.5 text-[10px] text-white font-bold">
                    ✓
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center">{formatDate(d.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
