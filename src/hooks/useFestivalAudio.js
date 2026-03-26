/**
 * Festival audio hook — plays devotional chanting on festival days.
 * Auto-plays when a festival with audio is detected. User can toggle via TopBar icon.
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

const MUTE_KEY = 'festivalChantMuted';

export default function useFestivalAudio(location) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    try { return localStorage.getItem(MUTE_KEY) === 'true'; } catch { return false; }
  });

  // Detect today's festival
  const festivalAudio = useMemo(() => {
    try {
      const today = new Date();
      const data = getPanchangamForDate(today, location);
      const festivalName = data?.festival?.english;
      if (festivalName && FESTIVAL_AUDIO[festivalName]) {
        return FESTIVAL_AUDIO[festivalName];
      }
    } catch (_) {}
    return null;
  }, [location]);

  const festivalHasAudio = !!festivalAudio;

  // Initialize audio element
  useEffect(() => {
    if (!festivalAudio) return;

    const audio = new Audio(festivalAudio.file);
    audio.loop = true;
    audio.volume = 0.4; // Gentle volume
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
  }, [festivalAudio]);

  // Auto-play when not muted (handles browser autoplay policy)
  useEffect(() => {
    if (!festivalAudio || !audioRef.current || isMuted) return;

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
  }, [festivalAudio, isMuted]);

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

  return { isPlaying, isMuted, toggle, festivalHasAudio, festivalAudio };
}
