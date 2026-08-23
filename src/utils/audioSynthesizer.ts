/**
 * Web Audio API Sound Generator for Baby Soothing Sounds
 * Creates synthetic white noise, pink noise, brown noise, womb heartbeat, rain, and lullaby notes.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrackId: string | null = null;
  private activeNodes: { [key: string]: any } = {};
  private timerId: any = null;
  private lullabyIntervalId: any = null;
  private volume: number = 0.5;
  private gainNode: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.gainNode && this.ctx) {
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public isPlaying(trackId?: string): boolean {
    if (trackId) {
      return this.currentTrackId === trackId;
    }
    return this.currentTrackId !== null;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrackId;
  }

  public stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.lullabyIntervalId) {
      clearInterval(this.lullabyIntervalId);
      this.lullabyIntervalId = null;
    }

    try {
      if (this.activeNodes.source) {
        this.activeNodes.source.stop();
        this.activeNodes.source.disconnect();
      }
      if (this.activeNodes.rainSource) {
        this.activeNodes.rainSource.stop();
        this.activeNodes.rainSource.disconnect();
      }
    } catch (e) {
      // ignore already stopped
    }

    this.activeNodes = {};
    this.currentTrackId = null;
  }

  public play(trackType: string, trackId: string, durationMinutes?: number) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    this.currentTrackId = trackId;

    if (trackType === 'white_noise') {
      this.playWhiteNoise();
    } else if (trackType === 'pink_noise') {
      this.playPinkNoise();
    } else if (trackType === 'brown_noise') {
      this.playBrownNoise();
    } else if (trackType === 'heartbeat') {
      this.playHeartbeat();
    } else if (trackType === 'rain') {
      this.playRain();
    } else if (trackType === 'ocean_waves') {
      this.playOceanWaves();
    } else if (trackType === 'lullaby_melody') {
      this.playLullabyMelody();
    }

    if (durationMinutes && durationMinutes > 0) {
      this.timerId = setTimeout(() => {
        this.stop();
      }, durationMinutes * 60 * 1000);
    }
  }

  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Gentle low-pass filter to make it pleasant for baby's ears
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.source = whiteNoise;
  }

  private playPinkNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const pinkNoise = this.ctx.createBufferSource();
    pinkNoise.buffer = noiseBuffer;
    pinkNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;

    pinkNoise.connect(filter);
    filter.connect(this.gainNode);
    pinkNoise.start();

    this.activeNodes.source = pinkNoise;
  }

  private playBrownNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    brownNoise.connect(filter);
    filter.connect(this.gainNode);
    brownNoise.start();

    this.activeNodes.source = brownNoise;
  }

  private playHeartbeat() {
    if (!this.ctx || !this.gainNode) return;
    const bpm = 68;
    const intervalMs = (60 / bpm) * 1000;

    const beat = () => {
      if (!this.ctx || !this.gainNode || this.currentTrackId !== 'womb-heartbeat') return;
      const now = this.ctx.currentTime;

      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      gain1.gain.setValueAtTime(0.7, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(this.gainNode);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Dub (slightly softer, ~140ms later)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(70, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.24);

      gain2.gain.setValueAtTime(0.5, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc2.connect(gain2);
      gain2.connect(this.gainNode);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.25);
    };

    beat();
    this.lullabyIntervalId = setInterval(beat, intervalMs);
  }

  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const rain = this.ctx.createBufferSource();
    rain.buffer = noiseBuffer;
    rain.loop = true;

    // Bandpass + high-shelf for raindrops sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    rain.connect(filter);
    filter.connect(this.gainNode);
    rain.start();

    this.activeNodes.source = rain;
  }

  private playOceanWaves() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const ocean = this.ctx.createBufferSource();
    ocean.buffer = noiseBuffer;
    ocean.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;

    // Modulate gain smoothly like ocean tides (every 6 seconds)
    const waveGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.15; // 6.6s cycle
    lfoGain.gain.value = 0.3;
    waveGain.gain.value = 0.4;

    lfo.connect(waveGain.gain);
    lfo.start();

    ocean.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode);
    ocean.start();

    this.activeNodes.source = ocean;
  }

  private playLullabyMelody() {
    if (!this.ctx || !this.gainNode) return;

    // Twinkle Twinkle / Brahms melody notes (frequencies)
    const notes = [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // C C G G A A G
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63, // F F E E D D C
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, // G G F F E E D
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66, // G G F F E E D
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00, // C C G G A A G
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63  // F F E E D D C
    ];

    let noteIdx = 0;

    const playNote = () => {
      if (!this.ctx || !this.gainNode || this.currentTrackId !== 'brahms-lullaby') return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Soft music-box chime bell timbre (sine + soft harmonic)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);
      osc.start(now);
      osc.stop(now + 1.2);
    };

    playNote();
    this.lullabyIntervalId = setInterval(playNote, 1000);
  }
}

export const soundEngine = new SoundEngine();
