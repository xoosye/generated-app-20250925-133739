import React, { useRef, useEffect, useState } from 'react';
import { useAudioPlayerStore } from '@/stores/audioPlayerStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
export function AudioPlayer() {
  const { episode, isPlaying, togglePlayPause, stop } = useAudioPlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (episode) {
      if (audio.src !== episode.audioUrl) {
        audio.src = episode.audioUrl;
        audio.load();
      }

      if (isPlaying) {
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
      audio.src = '';
    }
  }, [episode, isPlaying]);
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setProgress(value[0]);
    }
  };
  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={togglePlayPause}
      />
      <AnimatePresence>
        {episode && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-md border-t-2 border-cyan-400/50 z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              <div className="flex items-center gap-4 w-1/3">
                <Music className="h-10 w-10 text-cyan-400" />
                <div>
                  <p className="text-lg font-bold text-cyan-400 truncate">{episode.title}</p>
                  <p className="text-sm text-gray-400 truncate">EchoWave Player</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-1/3 justify-center">
                <Button onClick={togglePlayPause} variant="ghost" size="icon" className="text-yellow-300 hover:text-black hover:bg-yellow-300 rounded-full h-14 w-14">
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
              </div>
              <div className="flex items-center gap-4 w-1/3 justify-end">
                <span className="text-sm text-gray-400 w-12 text-center">{formatTime(progress)}</span>
                <Slider
                  value={[progress]}
                  max={duration}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full max-w-xs"
                />
                <span className="text-sm text-gray-400 w-12 text-center">{formatTime(duration)}</span>
                <Button onClick={stop} variant="ghost" size="icon" className="text-magenta hover:text-white">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}