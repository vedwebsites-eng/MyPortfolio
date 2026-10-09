import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

/**
 * Swappable placeholder lyrics timeline array.
 * Timestamps (in seconds) match real audio file playback.
 */
export const DEFAULT_LYRICS: LyricLine[] = [
  { time: 0,    text: "hey, I'm Vedant" },
  { time: 2.2,  text: "somewhere from the world" },
  { time: 4.4,  text: "welcome in" },
  { time: 6.6,  text: "I like to build cool stuff" },
  { time: 8.8,  text: "and yes" },
  { time: 10.9, text: "this is who I am" },
];

export interface IntroLyricsProps {
  trackSrc?: string;
  trackName?: string;
  lyrics?: LyricLine[];
  onComplete?: () => void;
}

const BADGE_SIZE = 150;
const HALF_BADGE_SIZE = BADGE_SIZE / 2; // 75px: Exactly half the wheel can go outside the frame, never the full circle

/**
 * Calculates badge position clamped so up to half of the wheel (75px)
 * can extend outside the viewport frame on any side, but never the full circle.
 */
const getClampedBadgePos = (x: number, y: number): { x: number; y: number } => {
  if (typeof window === 'undefined') return { x, y };
  const isMobile = window.innerWidth < 640;
  // On mobile, keep completely inside viewport to eliminate any horizontal scrolling
  // Keep safely away from the browser scrollbar and right-hand edge
  const minX = isMobile ? 12 : -HALF_BADGE_SIZE;
  const maxX = isMobile ? Math.max(12, window.innerWidth - BADGE_SIZE - 16) : Math.max(minX, window.innerWidth - BADGE_SIZE - 24);
  const minY = 16;
  const maxY = Math.max(minY, window.innerHeight - BADGE_SIZE - 20);
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
};

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
  const [needsTapToPlay, setNeedsTapToPlay] = useState<boolean>(false);

  // Persistent badge state
  const [isBadgeVisible, setIsBadgeVisible] = useState<boolean>(hasPlayed);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Draggable badge position: allows up to half the wheel outside the frame, never the full circle
  const [badgePos, setBadgePos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('vex_badge_pos');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
            if (parsed.x === 24) {
              return getClampedBadgePos(-HALF_BADGE_SIZE, window.innerHeight - 174);
            }
            return getClampedBadgePos(parsed.x, parsed.y);
          }
        }
        const isMobile = window.innerWidth < 640;
        return getClampedBadgePos(isMobile ? 12 : -HALF_BADGE_SIZE, window.innerHeight - 174);
      } catch {
        // ignore
      }
    }
    return { x: 12, y: 550 };
  });

  const badgePosRef = useRef<{ x: number; y: number }>(badgePos);
  useEffect(() => {
    badgePosRef.current = badgePos;
  }, [badgePos]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);
  const justDraggedRef = useRef<boolean>(false);

  // Keep badge within bounds (allowing up to half the circle outside the frame, never full) on window resize
  useEffect(() => {
    const handleResize = () => {
      setBadgePos((prev) => getClampedBadgePos(prev.x, prev.y));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only primary mouse button or touch
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: badgePos.x,
      initialY: badgePos.y,
      hasMoved: false,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current) return;

    const dx = e.clientX - dragInfoRef.current.startX;
    const dy = e.clientY - dragInfoRef.current.startY;

    // Distinguish click from drag: only treat as drag once moved > 5px
    if (!dragInfoRef.current.hasMoved && Math.hypot(dx, dy) > 5) {
      dragInfoRef.current.hasMoved = true;
      setIsDragging(true);
    }

    if (dragInfoRef.current.hasMoved) {
      const clamped = getClampedBadgePos(
        dragInfoRef.current.initialX + dx,
        dragInfoRef.current.initialY + dy
      );
      badgePosRef.current = clamped;
      setBadgePos(clamped);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragInfoRef.current) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (dragInfoRef.current.hasMoved) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 120);

      // Persist badge position in sessionStorage
      try {
        sessionStorage.setItem('vex_badge_pos', JSON.stringify(badgePosRef.current));
      } catch {
        // ignore
      }
    }

    dragInfoRef.current = null;
    setIsDragging(false);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  // Mute / Unmute audio toggle
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (justDraggedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasCompletedRef = useRef<boolean>(false);

  // Finish intro sequence and migrate stage to bottom-left corner badge
  const finishIntro = useCallback(
    (immediate = false) => {
      // Set session storage flag to prevent repeating in same session
      try {
        sessionStorage.setItem('introPlayed', 'true');
      } catch {
        // Ignore private browsing storage errors
      }

      if (immediate) {
        setIsOverlayMounted(false);
        setIsBadgeVisible(true);
        setIsMigrating(false);
        setIsOverlayFading(false);
        if (onComplete) {
          onComplete();
        }
        return;
      }

      // Trigger lyric stage migration & overlay fade-out (~0.9s duration)
      setIsMigrating(true);
      setIsOverlayFading(true);
      setIsBadgeVisible(true);

      setTimeout(() => {
        setIsOverlayMounted(false);
        if (onComplete) {
          onComplete();
        }
      }, 900);
    },
    [onComplete]
  );

  // Immediate skip action: pauses audio if playing and jumps straight to finished state
  const handleSkip = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    setIsPlaying(false);
    hasCompletedRef.current = true;
    finishIntro(true);
  }, [finishIntro]);

  // User gesture handler when browser blocks initial autoplay
  const handleTapToBegin = useCallback(() => {
    setNeedsTapToPlay(false);
    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Playback failed after tap:', err);
        });
    }
  }, []);

  // 1. On mount: attempt autoplay. If blocked by browser policy, show tap prompt.
  useEffect(() => {
    if (hasPlayed) {
      setIsBadgeVisible(true);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setNeedsTapToPlay(false);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log('Autoplay prevented by browser policy, tap prompt enabled:', err?.message || err);
          setNeedsTapToPlay(true);
        });
    }
  }, [hasPlayed]);

  // 2. Audio-driven lyric synchronizer: listens to timeupdate & frame ticks
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || hasPlayed) return;

    const handleTimeCheck = () => {
      if (hasCompletedRef.current) return;
      const currentTime = audio.currentTime;

      // Identify currently active line: the last lyric whose time <= audio.currentTime
      let activeIdx = 0;
      for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].time <= currentTime) {
          activeIdx = i;
        } else {
          break;
        }
      }

      setCurrentLineIndex(activeIdx);

      // Slide-up exit transition starts ~220ms before the next line's timestamp
      if (activeIdx < lyrics.length - 1) {
        const nextTime = lyrics[activeIdx + 1].time;
        setIsLineExiting(currentTime >= nextTime - 0.22);
      } else {
        setIsLineExiting(false);
      }

      // Finish/migrate to corner when currentTime reaches last lyric time + 1.1s buffer (~12.0s)
      const lastLyricTime = lyrics[lyrics.length - 1]?.time ?? 10.9;
      if (currentTime >= lastLyricTime + 1.1) {
        hasCompletedRef.current = true;
        finishIntro(false);
      }
    };

    // Standard audio timeupdate event listener
    audio.addEventListener('timeupdate', handleTimeCheck);

    // Frame-accurate poll while audio is playing for sub-millisecond animation trigger precision
    let rafId: number;
    const frameLoop = () => {
      if (!audio.paused && !hasCompletedRef.current) {
        handleTimeCheck();
      }
      rafId = requestAnimationFrame(frameLoop);
    };
    rafId = requestAnimationFrame(frameLoop);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeCheck);
      cancelAnimationFrame(rafId);
    };
  }, [lyrics, hasPlayed, finishIntro]);

  // 3. Escape key listener for instant skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOverlayMounted) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip, isOverlayMounted]);

  // Playback control toggler for persistent badge
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Guard: ignore click if user just completed a drag movement
    if (justDraggedRef.current) {
      return;
    }

    if (!trackSrc) {
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.warn('Audio playback failed:', err);
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
        preload="auto"
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
          onClick={needsTapToPlay ? handleTapToBegin : undefined}
          className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-opacity duration-700 ${
            isOverlayFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${needsTapToPlay ? 'cursor-pointer' : ''}`}
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
                AUDIO_STAGE // SYNC
              </span>
            </div>

            {/* Skip intro button (pauses audio & jumps straight to finished badge state) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSkip();
              }}
              type="button"
              className="text-[11px] font-mono text-zinc-400 hover:text-emerald-300 px-3.5 py-2 min-h-[44px] inline-flex items-center rounded-md border border-white/10 hover:border-emerald-500/40 bg-[#06080b]/60 backdrop-blur-sm transition-all cursor-pointer"
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

            {/* Minimal Tap-to-Begin Prompt when autoplay is blocked by browser policy */}
            {needsTapToPlay && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleTapToBegin();
                }}
                className="mt-8 flex items-center space-x-2.5 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_18px_rgba(52,211,153,0.25)] hover:shadow-[0_0_24px_rgba(52,211,153,0.4)] transition-all animate-pulse"
              >
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>[ TAP TO BEGIN AUDIO & SYNC ]</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Persistent "Now Playing" Full Circular Badge (150px, Draggable) */}
      <div
        className={`fixed z-40 select-none ${
          isBadgeVisible
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-75 pointer-events-none'
        }`}
        style={{
          left: 0,
          top: 0,
          transform: `translate3d(${badgePos.x}px, ${badgePos.y}px, 0)`,
          transition: isDragging
            ? 'none'
            : 'opacity 700ms ease-out, transform 200ms ease-out',
        }}
        aria-label="Now Playing Audio Badge"
      >
        {/* Full 150px rounded container */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onClick={togglePlay}
          title={isDragging ? undefined : "Drag to reposition • Controls centered"}
          className={`relative w-[150px] h-[150px] rounded-full overflow-hidden bg-[#06080b]/90 backdrop-blur-md border border-emerald-500/30 shadow-[0_0_28px_rgba(0,0,0,0.8)] touch-none transition-shadow ${
            isDragging
              ? 'cursor-grabbing shadow-[0_0_36px_rgba(52,211,153,0.4)] ring-1 ring-emerald-500/50'
              : 'cursor-grab hover:shadow-[0_0_30px_rgba(52,211,153,0.25)]'
          }`}
        >
          {/* Concentric subtle groove rings */}
          <div className="absolute inset-0 rounded-full bg-[#06080b] border border-white/5 pointer-events-none" />
          <div className="absolute inset-2.5 rounded-full border border-emerald-500/10 pointer-events-none" />
          <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute inset-10 rounded-full border border-emerald-500/10 pointer-events-none" />

          {/* Spinning SVG text container */}
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
                {/* Full 360° circular path with radius 54px centered at (75, 75). Circumference ≈ 339.3px */}
                <path
                  id="intro-now-playing-circle-path"
                  d="M 75, 75 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0"
                  fill="none"
                />
              </defs>
              <text className="font-mono text-[8.5px] font-bold tracking-[0.16em] fill-emerald-400 uppercase select-none">
                <textPath
                  href="#intro-now-playing-circle-path"
                  startOffset="0%"
                >
                  • NOW PLAYING • {trackName} • NOW PLAYING • {trackName} • NOW PLAYING • {trackName}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Centered Controls Hub: Play/Pause and Mute Buttons (min 44px tap targets) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center space-x-1.5 p-1 rounded-full bg-[#0b1017]/95 border border-emerald-500/40 shadow-[0_0_16px_rgba(52,211,153,0.3)]">
            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay(e);
              }}
              type="button"
              title={isPlaying ? 'Pause Track' : 'Play Track'}
              aria-label={isPlaying ? 'Pause Track' : 'Play Track'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute(e);
              }}
              type="button"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
