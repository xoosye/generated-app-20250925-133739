import { create } from 'zustand';
import type { Episode } from '@shared/types';
interface AudioPlayerState {
  episode: Episode | null;
  isPlaying: boolean;
  playEpisode: (episode: Episode) => void;
  togglePlayPause: () => void;
  stop: () => void;
}
export const useAudioPlayerStore = create<AudioPlayerState>((set, get) => ({
  episode: null,
  isPlaying: false,
  playEpisode: (episode) => {
    // If the same episode is played again, just toggle play/pause
    if (get().episode?.id === episode.id) {
      set((state) => ({ isPlaying: !state.isPlaying }));
    } else {
      // Play a new episode
      set({ episode, isPlaying: true });
    }
  },
  togglePlayPause: () => {
    if (get().episode) {
      set((state) => ({ isPlaying: !state.isPlaying }));
    }
  },
  stop: () => {
    set({ episode: null, isPlaying: false });
  },
}));