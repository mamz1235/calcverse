
import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX, Activity } from 'lucide-react';

interface Props {
  mode: 'metronome' | 'tone';
  value: number; // BPM or Hz
}

export const AudioVisualizer: React.FC<Props> = ({ mode, value }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastBeatTimeRef = useRef(0);
  const valueRef = useRef(value);

  // Constants
  const lookahead = 25.0; 
  const scheduleAheadTime = 0.1; 

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = () => {
    initAudio();
    const ctx = audioCtxRef.current!;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(valueRef.current, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start();
    
    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    analyserRef.current = analyser;

    drawWaveform();
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch(e) {}
      oscillatorRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const scheduleNote = (time: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = 800;
    gain.gain.value = volume;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + 0.05);
    
    const drawTime = (time - ctx.currentTime) * 1000;
    setTimeout(() => { lastBeatTimeRef.current = performance.now(); }, Math.max(0, drawTime));
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / valueRef.current;
    nextNoteTimeRef.current += secondsPerBeat;
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTimeRef.current);
        nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  const startMetronome = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;
    scheduler();
    drawMetronome();
  };

  const stopMetronome = () => {
    if (timerIDRef.current) clearTimeout(timerIDRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const drawMetronome = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const now = performance.now();
        const timeSinceBeat = now - lastBeatTimeRef.current;
        
        // Visual Beat
        const decay = Math.max(0, 1 - timeSinceBeat / 200);
        const radius = 30 + (decay * 20);

        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(99, 102, 241, ${decay * 0.5})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 20, 0, 2 * Math.PI);
        ctx.fillStyle = isPlaying ? '#6366f1' : '#475569';
        ctx.fill();

        if (isPlaying) animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) return;
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    draw();
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (mode === 'tone') stopTone();
      else stopMetronome();
      setIsPlaying(false);
    } else {
      if (mode === 'tone') playTone();
      else startMetronome();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
     if (isPlaying && mode === 'tone' && oscillatorRef.current && audioCtxRef.current) {
        oscillatorRef.current.frequency.setValueAtTime(valueRef.current, audioCtxRef.current.currentTime);
     }
  }, [value, isPlaying, mode]);

  useEffect(() => {
    return () => {
      stopTone();
      stopMetronome();
      if (audioCtxRef.current) {
          audioCtxRef.current.close();
      }
    };
  }, []);

  // Update volume in real-time
  useEffect(() => {
      if (gainNodeRef.current && audioCtxRef.current) {
          gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      }
  }, [volume]);

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl border border-border p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-200">
                {mode === 'metronome' ? 'Metronome' : 'Tone Generator'}
            </h3>
        </div>
        <div className="text-xs font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
            {Math.round(value)} {mode === 'metronome' ? 'BPM' : 'Hz'}
        </div>
      </div>

      <div className="relative h-32 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
         <canvas 
            ref={canvasRef} 
            width={600} 
            height={128} 
            className="w-full h-full"
         />
         {!isPlaying && (
             <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs uppercase tracking-wider font-bold">
                 {mode === 'metronome' ? 'Press Play to Start Beat' : 'Press Play to Generate Tone'}
             </div>
         )}
      </div>

      <div className="flex items-center gap-4">
        <button
            onClick={togglePlay}
            className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${isPlaying ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
        >
            {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            {isPlaying ? 'Stop' : 'Play'}
        </button>
        
        <div className="flex items-center gap-2 flex-1">
            <button onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
        </div>
      </div>
    </div>
  );
};
