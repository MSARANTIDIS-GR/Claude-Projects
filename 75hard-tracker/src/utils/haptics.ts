export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    const ms: Record<string, number[]> = {
      light:  [8],
      medium: [18],
      heavy:  [30, 10, 30],
    };
    navigator.vibrate(ms[style]);
  }
}
