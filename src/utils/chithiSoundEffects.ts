/**
 * Ultra-realistic, subtle pen-on-paper sound generator using Web Audio API synthesis.
 * Emulates the gentle, organic friction of a fountain pen nib scratching on textured paper.
 * Completely client-side, zero latency, zero external assets required.
 */

let audioCtx: AudioContext | null = null;
let lastSoundTime = 0;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
 * Plays an organic pen stroke scratch sound when typing
 */
export function playPenWritingSound(): void {
  const nowMs = Date.now();
  // Throttle strokes to sound like natural pen strokes (approx 55ms apart)
  if (nowMs - lastSoundTime < 45) return;
  lastSoundTime = nowMs;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const currentTime = ctx.currentTime;

    // Stroke duration between 40ms and 75ms for natural variation
    const duration = 0.04 + Math.random() * 0.035;

    // 1. Noise buffer generator for paper friction
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Pink/brown filtered noise grain
      const white = Math.random() * 2 - 1;
      output[i] = white * (0.8 + 0.2 * Math.sin(i * 0.15));
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // 2. Bandpass filter to match pen nib resonance frequency on paper (approx 1600Hz - 2800Hz)
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800 + Math.random() * 800, currentTime);
    bandpass.Q.setValueAtTime(2.2 + Math.random() * 1.5, currentTime);

    // 3. High shelf filter to soften treble so it doesn't sound harsh or like static
    const highShelf = ctx.createBiquadFilter();
    highShelf.type = 'highshelf';
    highShelf.frequency.setValueAtTime(3200, currentTime);
    highShelf.gain.setValueAtTime(-6, currentTime);

    // 4. Subtle gain envelope (attack -> decay), very gentle volume (0.035 to 0.055)
    const gainNode = ctx.createGain();
    const peakVolume = 0.035 + Math.random() * 0.015;

    gainNode.gain.setValueAtTime(0.001, currentTime);
    gainNode.gain.linearRampToValueAtTime(peakVolume, currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0005, currentTime + duration);

    // Connect node graph
    noiseSource.connect(bandpass);
    bandpass.connect(highShelf);
    highShelf.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(currentTime);
    noiseSource.stop(currentTime + duration);
  } catch {
    // Audio synthesis failure safe fallback
  }
}
