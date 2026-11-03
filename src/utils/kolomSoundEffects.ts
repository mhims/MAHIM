/**
 * Synthesized Web Audio API sound effects for Kolom-Kolom (Pen Fight) game.
 * Zero external asset dependencies, zero latency, ultra responsive.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

export function setSoundMuted(muted: boolean): void {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx || audioCtx.state === 'closed') {
    try {
      audioCtx = new AudioContextClass();
    } catch {
      return null;
    }
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Finger Flick sound: crisp snap when launching pen
 */
export function playFlickSound(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.09);

    // Haptic pulse on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15);
    }
  } catch {}
}

/**
 * Pen-to-Pen collision: rich plastic "ঠক" impact sound
 */
export function playHitSound(speed = 10): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const volume = Math.min(0.9, Math.max(0.2, speed / 15));
    const baseFreq = 650 + Math.random() * 200;

    // Body knock
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.07);

    // Plastic click transient
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();

    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(1200, ctx.currentTime);
    clickGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(ctx.currentTime);
    clickOsc.stop(ctx.currentTime + 0.025);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(Math.min(45, Math.floor(speed * 2.5)));
    }
  } catch {}
}

/**
 * Pen falling off desk: whistling pitch drop + desk floor "ধপ"
 */
export function playFallSound(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.45);

    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.52);

    // Distant floor impact after falling
    setTimeout(() => {
      try {
        const floorOsc = ctx.createOscillator();
        const floorGain = ctx.createGain();
        floorOsc.type = 'triangle';
        floorOsc.frequency.setValueAtTime(90, ctx.currentTime);
        floorGain.gain.setValueAtTime(0.4, ctx.currentTime);
        floorGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        floorOsc.connect(floorGain);
        floorGain.connect(ctx.destination);
        floorOsc.start();
        floorOsc.stop(ctx.currentTime + 0.14);
      } catch {}
    }, 380);

    // Strong vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 50, 40]);
    }
  } catch {}
}

/**
 * Victory fanfare when winning round or match
 */
export function playVictorySound(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [392.0, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const noteStart = startTime + idx * 0.1;
      const noteEnd = noteStart + 0.28;

      gain.gain.setValueAtTime(0.01, noteStart);
      gain.gain.linearRampToValueAtTime(0.45, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd + 0.02);
    });
  } catch {}
}

/**
 * Round lost sound
 */
export function playRoundLossSound(): void {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [392.0, 369.99, 329.63]; // Descending sad tones
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const noteStart = startTime + idx * 0.15;
      const noteEnd = noteStart + 0.25;

      gain.gain.setValueAtTime(0.35, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteEnd + 0.02);
    });
  } catch {}
}
