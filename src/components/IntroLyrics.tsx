import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

/**
 * Swappable placeholder lyrics timeline array.
 * Adjust timestamps (in seconds) and text lines as needed.
 */
export const DEFAULT_LYRICS: LyricLine[] = [
  { time: 0, text: "init sequence" },
  { time: 1.1, text: "init sequence" },
  { time: 2.2, text: "oh, we're live" },
  { time: 3.4, text: "system online" },
  { time: 4.5, text: "system online" },
  { time: 5.6, text: "oh, we're live" },
];

export interface IntroLyricsProps {
  trackSrc?: string;
  trackName?: string;
  lyrics?: LyricLine[];
  onComplete?: () => void;
}

export const IntroLyrics: React.FC<IntroLyricsProps> = ({
  trackSrc,
  trackName = 'SYSTEM_AUDIO',
  lyrics = DEFAULT_LYRICS,
  onComplete,
}) => {
  // Check if intro has already run in this browser session
  const [hasPlayed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('introPlayed') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  // State management for intro overlay sequence
  const [isOverlayMounted, setIsOverlayMounted] = useState<boolean>(!hasPlayed);
  const [isOverlayFading, setIsOverlayFading] = useState<boolean>(false);
  const [isMigrating, setIsMigrating] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [isLineExiting, setIsLineExiting] = useState<boolean>(false);

  // Persistent badge state
  const [isBadgeVisible, setIsBadgeVisible] = useState<boolean>(hasPlayed);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Clear all pending intro timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Finish intro sequence and migrate stage to bottom-left corner badge
  const finishIntro = useCallback(() => {
    clearAllTimeouts();

    // Set session storage flag to prevent repeating in same session
    try {
      sessionStorage.setItem('introPlayed', 'true');
    } catch {
      // Ignore private browsing storage errors
    }

    // Trigger lyric stage migration & overlay fade-out (~0.9s duration)
    setIsMigrating(true);
    setIsOverlayFading(true);
    setIsBadgeVisible(true);

    const unmountTimer = setTimeout(() => {
      setIsOverlayMounted(false);
      if (onComplete) {
        onComplete();
      }
    }, 900);
    timeoutsRef.current.push(unmountTimer);
  }, [clearAllTimeouts, onComplete]);

  // Main intro timeline runner
  useEffect(() => {
    if (hasPlayed) {
      setIsBadgeVisible(true);
      return;
    }

    clearAllTimeouts();

    // Schedule each line's pop-in and slide-up exit
    lyrics.forEach((line, idx) => {
      // Line appearance timer
      const enterTimer = setTimeout(() => {
        setCurrentLineIndex(idx);
        setIsLineExiting(false);
      }, line.time * 1000);
      timeoutsRef.current.push(enterTimer);

      // Line slide-up exit transition (200ms before next line)
      if (idx < lyrics.length - 1) {
        const nextLineTime = lyrics[idx + 1].time;
        const exitDelay = Math.max(0, nextLineTime * 1000 - 220);
        const exitTimer = setTimeout(() => {
          setIsLineExiting(true);
        }, exitDelay);
        timeoutsRef.current.push(exitTimer);
      }
    });

    // Calculate total sequence time (~6.7s for default timeline)
    const lastLineTime = lyrics[lyrics.length - 1]?.time ?? 5.6;
    const finishDelay = (lastLineTime + 1.1) * 1000;

    const finishTimer = setTimeout(() => {
      finishIntro();
    }, finishDelay);
    timeoutsRef.current.push(finishTimer);

    // Escape key listener to allow instant skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearAllTimeouts();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasPlayed, lyrics, finishIntro, clearAllTimeouts]);

  // Playback control toggler
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Guard: if trackSrc is empty or undefined, play() is a no-op
    if (!trackSrc) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        // Handle playback errors or missing files gracefully
        console.warn('Audio playback not ready or file missing:', err);
        setIsPlaying(false);
      });
    }
  };

  const currentLyric = lyrics[currentLineIndex] || lyrics[0];

  return (
    <>
      {/* Component styles for bounce pop-in, exit, and spinning animation */}
      <style>{`
        @keyframes introLyricBounceIn {
          0% {
            opacity: 0;
            transform: translateY(32px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes introLyricSlideOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-26px) scale(0.92);
          }
        }

        .lyric-line-bounce {
          animation: introLyricBounceIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .lyric-line-slideout {
          animation: introLyricSlideOut 0.22s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes vinylSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .vinyl-spinning-disc {
          animation: vinylSpin 6s linear infinite;
        }
      `}</style>

      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={trackSrc}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      />

      {/* Full-screen Glassy Intro Overlay */}
      {isOverlayMounted && (
        <div
          role="dialog"
          aria-label="Site Intro Sequence"
          className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-opacity duration-700 ${
            isOverlayFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{
            backgroundColor: 'rgba(6, 8, 11, 0.55)',
            backdropFilter: 'blur(22px) saturate(140%)',
            WebkitBackdropFilter: 'blur(22px) saturate(140%)',
          }}
        >
          {/* Top terminal telemetry bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center space-x-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-widest uppercase text-emerald-400 font-semibold text-[11px]">
                AUDIO_STAGE // INIT
              </span>
            </div>

            {/* Skip intro button */}
            <button
              onClick={finishIntro}
              type="button"
              className="text-[11px] font-mono text-zinc-400 hover:text-emerald-300 px-3 py-1.5 rounded-md border border-white/10 hover:border-emerald-500/40 bg-[#06080b]/60 backdrop-blur-sm transition-all cursor-pointer"
            >
              [ESC / SKIP]
            </button>
          </div>

          {/* Centered Lyric Stage */}
          <div
            className="relative flex flex-col items-center justify-center px-6 text-center transition-all duration-[900ms]"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transform: isMigrating
                ? 'translate(calc(-50vw + 60px), calc(50vh - 80px)) scale(0.18)'
                : 'translate(0, 0) scale(1)',
              opacity: isMigrating ? 0 : 1,
            }}
          >
            {/* Spotify-style pop-in / slide-out lyric display */}
            <div className="min-h-[120px] flex items-center justify-center">
              <div
                key={currentLineIndex}
                className={`font-mono text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] ${
                  isLineExiting ? 'lyric-line-slideout' : 'lyric-line-bounce'
                }`}
              >
                <span className="text-emerald-400 font-mono select-none mr-3 opacity-90">
                  &gt;
                </span>
                <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  {currentLyric?.text}
                </span>
              </div>
            </div>

            {/* Subtle timeline track indicator */}
            <div className="mt-8 flex items-center space-x-1.5 opacity-60">
              {lyrics.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentLineIndex
                      ? 'w-7 bg-emerald-400'
                      : idx < currentLineIndex
                      ? 'w-3 bg-zinc-600'
                      : 'w-2 bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Persistent "Now Playing" Badge at Bottom-Left */}
      <div
        className={`fixed bottom-6 left-0 z-40 transition-all duration-700 ease-out select-none ${
          isBadgeVisible
            ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-x-10 scale-75 pointer-events-none'
        }`}
        aria-label="Now Playing Audio Badge"
      >
        {/*
          Clipped wrapper:
          Circle (150px) clipped to show only its right half
          (border-radius: 0 100px 100px 0 on an overflow-hidden wrapper)
        */}
        <div
          className="relative w-[75px] h-[150px] overflow-hidden bg-[#06080b]/90 backdrop-blur-md border-y border-r border-emerald-500/30 shadow-[0_0_24px_rgba(0,0,0,0.8)]"
          style={{
            borderRadius: '0 100px 100px 0',
          }}
        >
          {/*
            Full 150px circle shifted left by 75px so only its right half is visible.
            Center of circle is at x = 0 (the screen edge).
          */}
          <div
            className="absolute top-0 w-[150px] h-[150px]"
            style={{
              left: '-75px',
            }}
          >
            {/* Concentric subtle groove rings */}
            <div className="absolute inset-0 rounded-full bg-[#06080b] border border-white/5 pointer-events-none" />
            <div className="absolute inset-3 rounded-full border border-emerald-500/10 pointer-events-none" />
            <div className="absolute inset-7 rounded-full border border-white/5 pointer-events-none" />
            <div className="absolute inset-11 rounded-full border border-emerald-500/10 pointer-events-none" />

            {/*
              Spinning SVG disc containing circular <textPath>.
              Spinning via CSS animation (6s linear infinite) with animation-play-state paused until playback starts.
            */}
            <div
              className="absolute inset-0 vinyl-spinning-disc pointer-events-none"
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            >
              <svg
                viewBox="0 0 150 150"
                className="w-full h-full"
                aria-hidden="true"
              >
                <defs>
                  {/*
                    Circular path with radius 53px centered at (75, 75).
                    Circumference ≈ 333px.
                  */}
                  <path
                    id="intro-now-playing-circle-path"
                    d="M 75, 75 m -53, 0 a 53,53 0 1,1 106,0 a 53,53 0 1,1 -106,0"
                    fill="none"
                  />
                </defs>
                <text className="font-mono text-[9px] font-bold tracking-[0.22em] fill-emerald-400 uppercase select-none">
                  <textPath
                    href="#intro-now-playing-circle-path"
                    startOffset="0%"
                  >
                    • NOW PLAYING • {trackName} • NOW PLAYING • {trackName} •
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/*
            Circular Play/Pause Button:
            Centered on the badge's visible arc.
            Toggles play/pause on the <audio> element and syncs with spinning disc animation.
          */}
          <button
            onClick={togglePlay}
            type="button"
            title={isPlaying ? 'Pause Track' : 'Play Track'}
            aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
            className="absolute top-1/2 left-[28px] -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[#0b1017] border border-emerald-500/50 hover:border-emerald-300 text-emerald-400 hover:text-emerald-300 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:shadow-[0_0_18px_rgba(52,211,153,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
