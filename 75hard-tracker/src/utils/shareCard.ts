import type { DayRecord } from '../types';

const W = 1080, H = 1920;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function make(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  return [c, c.getContext('2d')!];
}

function drawBranding(ctx: CanvasRenderingContext2D, y: number) {
  ctx.save();
  ctx.font = 'bold 52px system-ui';
  ctx.fillStyle = '#f97316';
  ctx.textAlign = 'center';
  ctx.fillText('75 HARD', W / 2, y);
  ctx.font = '38px system-ui';
  ctx.fillStyle = '#374151';
  ctx.fillText('Mental Toughness Challenge', W / 2, y + 55);
  ctx.restore();
}

// ── Card 1: Day Complete ──────────────────────────────────────────────────────
export async function generateDayCard(day: number, record: DayRecord): Promise<string> {
  const [canvas, ctx] = make();

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#030712');
  bg.addColorStop(1, '#0a1020');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Orange top stripe
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 0, W, 10);

  // Branding
  drawBranding(ctx, 140);

  // Day number
  ctx.font = 'bold 280px system-ui';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(`${day}`, W / 2, 550);

  ctx.font = '600 80px system-ui';
  ctx.fillStyle = '#4b5563';
  ctx.fillText(`Day   of 75`, W / 2, 550);
  // Draw "Day" before the number and "of 75" after
  ctx.font = '600 72px system-ui';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('Day', W / 2 - 220, 450);
  ctx.fillText('of 75', W / 2 + 120, 640);

  // Progress bar
  const barX = 100, barY = 720, barW = W - 200, barH = 22;
  const pct = Math.min(day / 75, 1);
  ctx.fillStyle = '#1f2937';
  rr(ctx, barX, barY, barW, barH, 11); ctx.fill();
  ctx.fillStyle = '#f97316';
  if (pct > 0) { rr(ctx, barX, barY, barW * pct, barH, 11); ctx.fill(); }
  ctx.font = '400 44px system-ui';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`${Math.round(pct * 100)}% of the challenge complete`, W / 2, 808);

  // Tasks
  const tasks = [
    { label: 'Followed my diet',                                    done: record.diet },
    { label: `Workout 1${record.workout1Outdoor ? '  🌳 Outdoor' : ''}`, done: record.workout1 },
    { label: `Workout 2${record.workout2Outdoor ? '  🌳 Outdoor' : ''}`, done: record.workout2 },
    { label: `Water  —  ${record.waterOz} oz`,                      done: record.waterOz >= 128 },
    { label: `Read  —  ${record.pagesRead} pages`,                  done: record.pagesRead >= 10 },
    { label: 'Progress photo taken',                                 done: record.photoTaken },
  ];

  let ty = 940;
  for (const t of tasks) {
    // Row background
    ctx.fillStyle = t.done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)';
    rr(ctx, 80, ty - 52, W - 160, 90, 18); ctx.fill();

    // Check/cross
    ctx.font = 'bold 52px system-ui';
    ctx.fillStyle = t.done ? '#10b981' : '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(t.done ? '✓' : '×', 120, ty);

    // Label
    ctx.font = `${t.done ? '500' : '400'} 46px system-ui`;
    ctx.fillStyle = t.done ? '#d1fae5' : '#4b5563';
    ctx.fillText(t.label, 200, ty);

    ty += 118;
  }

  // Footer
  ctx.textAlign = 'center';
  ctx.font = '400 46px system-ui';
  ctx.fillStyle = '#4b5563';
  ctx.fillText('Follow my 75 Hard journey 🔥', W / 2, 1820);

  return canvas.toDataURL('image/png');
}

// ── Card 2: Progress Photo + Stats ────────────────────────────────────────────
export async function generatePhotoCard(day: number, record: DayRecord): Promise<string | null> {
  if (!record.photoData) return null;
  const [canvas, ctx] = make();

  const img = new Image();
  img.src = record.photoData;
  await new Promise(res => { img.onload = res; });

  // Cover-fit photo
  const scale = Math.max(W / img.width, H / img.height);
  const sw = img.width * scale, sh = img.height * scale;
  ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);

  // Gradient overlay bottom 65%
  const grad = ctx.createLinearGradient(0, H * 0.35, 0, H);
  grad.addColorStop(0, 'rgba(3,7,18,0)');
  grad.addColorStop(0.45, 'rgba(3,7,18,0.82)');
  grad.addColorStop(1,    'rgba(3,7,18,0.97)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Top branding
  ctx.font = 'bold 58px system-ui';
  ctx.fillStyle = '#f97316';
  ctx.textAlign = 'center';
  ctx.fillText('75 HARD', W / 2, 100);

  // Day number (big, near bottom)
  ctx.font = 'bold 240px system-ui';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${day}`, W / 2, H - 560);

  ctx.font = '600 70px system-ui';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText(`Day ${day} of 75`, W / 2, H - 440);

  // Quick task icons row
  const icons = ['🥗', '💪', '💧', '📖', '📸'];
  const dones  = [record.diet, record.workout1 && record.workout2, record.waterOz >= 128, record.pagesRead >= 10, record.photoTaken];
  const iconX  = [W/2 - 240, W/2 - 120, W/2, W/2 + 120, W/2 + 240];
  ctx.font = '70px system-ui';
  iconX.forEach((x, i) => {
    ctx.globalAlpha = dones[i] ? 1 : 0.25;
    ctx.fillText(icons[i], x, H - 280);
  });
  ctx.globalAlpha = 1;

  ctx.font = '400 44px system-ui';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('Follow my 75 Hard journey 🔥', W / 2, H - 100);

  return canvas.toDataURL('image/png');
}

// ── Card 3: Milestone ─────────────────────────────────────────────────────────
const MILESTONES: Record<number, { label: string; quote: string; accent: string }> = {
  1:  { label: 'Day 1 — Let\'s Go!',     quote: 'Every champion was once a contender who refused to give up.',  accent: '#3b82f6' },
  7:  { label: 'One Week Strong!',        quote: 'Seven days of discipline. The habit is taking root.',          accent: '#8b5cf6' },
  14: { label: 'Two Weeks!',              quote: 'You\'ve built something most people never even start.',         accent: '#ec4899' },
  21: { label: '21 Days!',               quote: 'Scientists say habits form in 21 days. Yours just did.',       accent: '#f59e0b' },
  30: { label: '30 Days Done!',           quote: 'Forty percent of the way there. You are not the same person.', accent: '#10b981' },
  45: { label: 'Halfway There!',          quote: 'Day 45. The summit is as close as the starting line.',         accent: '#f97316' },
  60: { label: '60 Days of Steel!',       quote: 'Two months of mental toughness. 15 days to go.',              accent: '#ef4444' },
  75: { label: '75 HARD — COMPLETE! 🏆', quote: 'You proved to yourself what you\'re made of.',                  accent: '#f59e0b' },
};

export async function generateMilestoneCard(day: number): Promise<string | null> {
  const m = MILESTONES[day];
  if (!m) return null;
  const [canvas, ctx] = make();

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#030712');
  bg.addColorStop(1, '#0d1117');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Accent top stripe
  ctx.fillStyle = m.accent;
  ctx.fillRect(0, 0, W, 12);

  // Large day number (ghost)
  ctx.font = 'bold 500px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.textAlign = 'center';
  ctx.fillText(`${day}`, W / 2, 820);

  // Milestone label
  ctx.font = 'bold 100px system-ui';
  ctx.fillStyle = m.accent;
  ctx.fillText(m.label, W / 2, 500);

  // Divider
  ctx.fillStyle = m.accent;
  ctx.fillRect(W / 2 - 100, 540, 200, 5);

  // Quote
  const words = m.quote.split(' ');
  const lines: string[] = [];
  let line = '';
  ctx.font = '400 62px system-ui';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > W - 200) { lines.push(line); line = w; }
    else line = test;
  }
  lines.push(line);
  ctx.fillStyle = '#9ca3af';
  lines.forEach((l, i) => ctx.fillText(l, W / 2, 680 + i * 85));

  // Progress bar
  const pct = day / 75;
  const barX = 100, barY = 1100, barW = W - 200;
  ctx.fillStyle = '#1f2937';
  rr(ctx, barX, barY, barW, 24, 12); ctx.fill();
  ctx.fillStyle = m.accent;
  rr(ctx, barX, barY, barW * pct, 24, 12); ctx.fill();
  ctx.font = '400 50px system-ui';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`${Math.round(pct * 100)}% complete`, W / 2, 1200);

  drawBranding(ctx, 1800);

  return canvas.toDataURL('image/png');
}

export const MILESTONE_DAYS = Object.keys(MILESTONES).map(Number);

// ── Share helper ──────────────────────────────────────────────────────────────
export async function shareOrDownload(dataUrl: string, filename: string, text: string) {
  const res  = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], filename, { type: 'image/png' });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: '75 Hard Progress', text });
  } else {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }
}
