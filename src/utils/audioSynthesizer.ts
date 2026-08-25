/**
 * Web Audio API Sound Generator for Baby Soothing Sounds
 * Features:
 * 1. Single track playback with custom timers (15m, 30m, 45m, 60m, 90m, Continuous)
 * 2. Multi-layer Sound Mixer: blend multiple soothing sound layers simultaneously
 *    (e.g., Rain + Pink Noise + Womb Heartbeat + Ocean Waves + Music Box) with individual volume sliders.
 * 3. Safe low-pass filters designed specifically for infant ear sensitivity.
 */

export interface SoundLayerConfig {
  id: string;
  name: string;
  type: string;
  volume: number; // 0 to 1
  enabled: boolean;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentTrackId: string | null = null;
  private activeNodes: { [key: string]: any } = {};
  private mixerNodes: { [trackId: string]: { source?: any; gainNode: GainNode; filter?: any; interval?: any } } = {};
  private timerId: any = null;
  private lullabyIntervalId: any = null;
  private masterVolume: number = 0.6;
  private masterGainNode: GainNode | null = null;
  private isMixerMode: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGainNode && this.ctx) {
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);
    }
  }

  public setVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public isPlaying(trackId?: string): boolean {
    if (this.isMixerMode) {
      if (trackId) {
        return !!this.mixerNodes[trackId];
      }
      return Object.keys(this.mixerNodes).length > 0;
    }
    if (trackId) {
      return this.currentTrackId === trackId;
    }
    return this.currentTrackId !== null;
  }

  public isMixerActive(): boolean {
    return this.isMixerMode && Object.keys(this.mixerNodes).length > 0;
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

    // Stop single track nodes
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
      // ignore
    }
    this.activeNodes = {};

    // Stop all mixer layer nodes
    Object.keys(this.mixerNodes).forEach(id => {
      this.stopMixerLayer(id);
    });
    this.mixerNodes = {};
    this.isMixerMode = false;
    this.currentTrackId = null;
  }

  // --- SINGLE TRACK PLAYBACK ---
  public play(trackType: string, trackId: string, durationMinutes?: number) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGainNode) return;

    this.isMixerMode = false;
    this.currentTrackId = trackId;

    if (trackType === 'white_noise') {
      this.playWhiteNoise(this.masterGainNode);
    } else if (trackType === 'pink_noise') {
      this.playPinkNoise(this.masterGainNode);
    } else if (trackType === 'brown_noise') {
      this.playBrownNoise(this.masterGainNode);
    } else if (trackType === 'heartbeat') {
      this.playHeartbeat(this.masterGainNode);
    } else if (trackType === 'rain') {
      this.playRain(this.masterGainNode);
    } else if (trackType === 'ocean_waves') {
      this.playOceanWaves(this.masterGainNode);
    } else if (trackType === 'lullaby_melody') {
      this.playLullabyMelody(this.masterGainNode);
    }

    if (durationMinutes && durationMinutes > 0) {
      this.timerId = setTimeout(() => {
        this.stop();
      }, durationMinutes * 60 * 1000);
    }
  }

  // --- MULTI-LAYER SOUND MIXER ---
  public setMixerLayer(trackType: string, trackId: string, enabled: boolean, layerVolume: number = 0.5) {
    this.initContext();
    if (!this.ctx || !this.masterGainNode) return;
    this.isMixerMode = true;
    this.currentTrackId = 'mixer-mode';

    if (!enabled) {
      this.stopMixerLayer(trackId);
      return;
    }

    // If layer is already playing, update its volume
    if (this.mixerNodes[trackId]) {
      this.mixerNodes[trackId].gainNode.gain.setValueAtTime(layerVolume, this.ctx.currentTime);
      return;
    }

    // Create a dedicated sub-gain node for this layer connected to master
    const layerGain = this.ctx.createGain();
    layerGain.gain.setValueAtTime(layerVolume, this.ctx.currentTime);
    layerGain.connect(this.masterGainNode);

    const layerObj: { source?: any; gainNode: GainNode; filter?: any; interval?: any } = {
      gainNode: layerGain
    };

    if (trackType === 'white_noise') {
      const src = this.createWhiteNoiseNode(layerGain);
      layerObj.source = src;
    } else if (trackType === 'pink_noise') {
      const src = this.createPinkNoiseNode(layerGain);
      layerObj.source = src;
    } else if (trackType === 'brown_noise') {
      const src = this.createBrownNoiseNode(layerGain);
      layerObj.source = src;
    } else if (trackType === 'heartbeat') {
      const interval = this.createHeartbeatLoop(layerGain);
      layerObj.interval = interval;
    } else if (trackType === 'rain') {
      const src = this.createRainNode(layerGain);
      layerObj.source = src;
    } else if (trackType === 'ocean_waves') {
      const src = this.createOceanWavesNode(layerGain);
      layerObj.source = src;
    } else if (trackType === 'lullaby_melody') {
      const interval = this.createLullabyLoop(layerGain);
      layerObj.interval = interval;
    }

    this.mixerNodes[trackId] = layerObj;
  }

  public setMixerTimer(durationMinutes: number) {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (durationMinutes > 0) {
      this.timerId = setTimeout(() => {
        this.stop();
      }, durationMinutes * 60 * 1000);
    }
  }

  private stopMixerLayer(trackId: string) {
    const node = this.mixerNodes[trackId];
    if (!node) return;
    try {
      if (node.source) {
        node.source.stop();
        node.source.disconnect();
      }
      if (node.interval) {
        clearInterval(node.interval);
      }
      node.gainNode.disconnect();
    } catch (e) {}
    delete this.mixerNodes[trackId];
  }

  // --- AUDIO SYNTHESIS GENERATORS ---
  private createWhiteNoiseNode(destination: AudioNode) {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    whiteNoise.connect(filter);
    filter.connect(destination);
    whiteNoise.start();
    return whiteNoise;
  }

  private createPinkNoiseNode(destination: AudioNode) {
    if (!this.ctx) return null;
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
    filter.connect(destination);
    pinkNoise.start();
    return pinkNoise;
  }

  private createBrownNoiseNode(destination: AudioNode) {
    if (!this.ctx) return null;
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
    filter.connect(destination);
    brownNoise.start();
    return brownNoise;
  }

  private createRainNode(destination: AudioNode) {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const rain = this.ctx.createBufferSource();
    rain.buffer = noiseBuffer;
    rain.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 0.5;

    rain.connect(filter);
    filter.connect(destination);
    rain.start();
    return rain;
  }

  private createOceanWavesNode(destination: AudioNode) {
    if (!this.ctx) return null;
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

    const waveGain = this.ctx.createGain();
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.15;
    waveGain.gain.value = 0.4;

    lfo.connect(waveGain.gain);
    lfo.start();

    ocean.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(destination);
    ocean.start();
    return ocean;
  }

  private createHeartbeatLoop(destination: AudioNode) {
    if (!this.ctx) return null;
    const bpm = 68;
    const intervalMs = (60 / bpm) * 1000;

    const beat = () => {
      if (!this.ctx) return;
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
      gain1.connect(destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Dub
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(70, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 0.24);
      gain2.gain.setValueAtTime(0.5, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc2.connect(gain2);
      gain2.connect(destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.25);
    };

    beat();
    return setInterval(beat, intervalMs);
  }

  private createLullabyLoop(destination: AudioNode) {
    if (!this.ctx) return null;
    const notes = [
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      392.00, 392.00, 349.23, 349.23, 329.63, 329.63, 293.66,
      261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,
      349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63
    ];
    let noteIdx = 0;

    const playNote = () => {
      if (!this.ctx) return;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(noteGain);
      noteGain.connect(destination);
      osc.start(now);
      osc.stop(now + 1.2);
    };

    playNote();
    return setInterval(playNote, 1000);
  }

  // --- SINGLE PLAY HELPER CALLS ---
  private playWhiteNoise(dest: AudioNode) {
    this.activeNodes.source = this.createWhiteNoiseNode(dest);
  }
  private playPinkNoise(dest: AudioNode) {
    this.activeNodes.source = this.createPinkNoiseNode(dest);
  }
  private playBrownNoise(dest: AudioNode) {
    this.activeNodes.source = this.createBrownNoiseNode(dest);
  }
  private playHeartbeat(dest: AudioNode) {
    this.lullabyIntervalId = this.createHeartbeatLoop(dest);
  }
  private playRain(dest: AudioNode) {
    this.activeNodes.source = this.createRainNode(dest);
  }
  private playOceanWaves(dest: AudioNode) {
    this.activeNodes.source = this.createOceanWavesNode(dest);
  }
  private playLullabyMelody(dest: AudioNode) {
    this.lullabyIntervalId = this.createLullabyLoop(dest);
  }
}

export const soundEngine = new SoundEngine();
