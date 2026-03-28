/**
 * Devotional audio hook — plays meditative chanting/music.
 * Always available via TopBar icon. Muted by default.
 * On festival days, plays festival-specific audio instead of default tanpura.
 * Audio persists across tab navigation (hook lives at App level).
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getPanchangamForDate } from '../data/panchangam';

// Festival → audio mapping (extensible)
const FESTIVAL_AUDIO = {
  'Sri Rama Navami': {
    file: '/assets/sounds/sri_rama_chant.mp3',
    label: 'శ్రీ రామ జయ రామ',
    labelEn: 'Sri Rama Jaya Rama',
  },
  // Future additions:
  // 'Vinayaka Chavithi': { file: '/assets/sounds/ganesh_chant.mp3', label: '...' },
};

// Default daily meditation audio
const DEFAULT_AUDIO = {
  file: '/assets/sounds/sri_rama_chant.mp3',
  label: 'ధ్యాన సంగీతం',
  labelEn: 'Meditation Music',
};

const MUTE_KEY = 'devotionalAudioMuted';

export default function useFestivalAudio(location) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem(MUTE_KEY);
      // Default to muted if never set
      return saved === null ? true : saved === 'true';
    } catch { return true; }
  });

  // Detect today's festival, fall back to default audio
  const activeAudio = useMemo(() => {
    try {
      const today = new Date();
      const data = getPanchangamForDate(today, location);
      const festivalName = data?.festival?.english;
      if (festivalName && FESTIVAL_AUDIO[festivalName]) {
        return { ...FESTIVAL_AUDIO[festivalName], isFestival: true };
      }
    } catch (_) {}
    return { ...DEFAULT_AUDIO, isFestival: false };
  }, [location]);

  // Always available
  const festivalHasAudio = true;

  // Initialize audio element
  useEffect(() => {
    if (!activeAudio) return;

    const audio = new Audio(activeAudio.file);
    audio.loop = true;
    audio.volume = 0.35; // Gentle volume
    audio.preload = 'auto';
    audioRef.current = audio;

    // Track play state
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [activeAudio]);

  // Only auto-play if user has previously unmuted (respects default muted state)
  useEffect(() => {
    if (!activeAudio || !audioRef.current || isMuted) return;

    const audio = audioRef.current;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked — wait for user interaction
        const resumeOnInteraction = () => {
          if (!isMuted && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
          document.removeEventListener('click', resumeOnInteraction);
          document.removeEventListener('touchstart', resumeOnInteraction);
        };
        document.addEventListener('click', resumeOnInteraction, { once: true });
        document.addEventListener('touchstart', resumeOnInteraction, { once: true });
      });
    };

    tryPlay();
  }, [activeAudio, isMuted]);

  // Toggle mute/unmute
  const toggle = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      try { localStorage.setItem(MUTE_KEY, String(next)); } catch {}

      if (audioRef.current) {
        if (next) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  }, []);

  return { isPlaying, isMuted, toggle, festivalHasAudio, festivalAudio: activeAudio };
}
