import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * CursorGlow Component
 * Renders a textured 3-layer cursor-trailing light effect.
 * In Dark Mode: Multi-layer luminous emerald glow.
 * In Light Mode: Clearly perceptible charcoal/slate radial gradient shadow-glow (~0.18-0.26 opacity).
 * Uses requestAnimationFrame lerp easing and GPU translate3d positioning.
 * Completely disabled on touch devices via matchMedia('(hover: hover) and (pointer: fine)').
 */
export const CursorGlow: React.FC = () => {
  const { theme } = useTheme();

  // Detect if the device has a fine pointer and supports hover (mouse)
  const [isHoverDevice, setIsHoverDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);

  // DOM refs for 3 layers of varying size: 600px, 450px, 300px
  const layer600Ref = useRef<HTMLDivElement | null>(null);
  const layer450Ref = useRef<HTMLDivElement | null>(null);
  const layer300Ref = useRef<HTMLDivElement | null>(null);

  // Positions and target coordinates
  const targetPos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const pos600 = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const pos450 = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const pos300 = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isInsideWindow = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!isHoverDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX;
      targetPos.current.y = e.clientY;

      if (!isInsideWindow.current) {
        isInsideWindow.current = true;
        setIsVisible(true);
        // Initialize layer coordinates right at cursor so they don't swoop across screen
        pos300.current = { x: e.clientX, y: e.clientY };
        pos450.current = { x: e.clientX + 24, y: e.clientY - 18 };
        pos600.current = { x: e.clientX - 30, y: e.clientY + 30 };
      }
    };

    const handleMouseLeave = () => {
      isInsideWindow.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isInsideWindow.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId: number;

    const updateGlow = () => {
      // Layer 3 (300px): Closest inner core, fastest follower (~0.18 lerp speed)
      pos300.current.x += (targetPos.current.x - pos300.current.x) * 0.18;
      pos300.current.y += (targetPos.current.y - pos300.current.y) * 0.18;

      // Layer 2 (450px): Mid halo, trailing with offset (~0.10 lerp speed)
      pos450.current.x += (targetPos.current.x + 24 - pos450.current.x) * 0.10;
      pos450.current.y += (targetPos.current.y - 18 - pos450.current.y) * 0.10;

      // Layer 1 (600px): Outer ambient aura, slowest trailing tail (~0.06 lerp speed)
      pos600.current.x += (targetPos.current.x - 30 - pos600.current.x) * 0.06;
      pos600.current.y += (targetPos.current.y + 30 - pos600.current.y) * 0.06;

      // Apply GPU translate3d positioning (translating by radius so centers align)
      if (layer300Ref.current) {
        layer300Ref.current.style.transform = `translate3d(${pos300.current.x - 150}px, ${pos300.current.y - 150}px, 0)`;
      }
      if (layer450Ref.current) {
        layer450Ref.current.style.transform = `translate3d(${pos450.current.x - 225}px, ${pos450.current.y - 225}px, 0)`;
      }
      if (layer600Ref.current) {
        layer600Ref.current.style.transform = `translate3d(${pos600.current.x - 300}px, ${pos600.current.y - 300}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateGlow);
    };

    animationFrameId = requestAnimationFrame(updateGlow);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHoverDevice]);

  if (!isHoverDevice) return null;

  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        mixBlendMode: isDark ? 'screen' : 'multiply',
      }}
    >
      {/* Layer 1: Outer Ambient Glow Circle (600px) */}
      <div
        ref={layer600Ref}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 55%, transparent 80%)'
            : 'radial-gradient(circle, rgba(51, 65, 85, 0.18) 0%, rgba(71, 85, 105, 0.08) 50%, transparent 75%)',
          filter: 'blur(56px)',
        }}
      />

      {/* Layer 2: Mid Textured Halo (450px) */}
      <div
        ref={layer450Ref}
        className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full will-change-transform"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(52, 211, 153, 0.16) 0%, rgba(16, 185, 129, 0.07) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(30, 41, 59, 0.22) 0%, rgba(51, 65, 85, 0.10) 45%, transparent 70%)',
          filter: 'blur(46px)',
        }}
      />

      {/* Layer 3: Inner Core Glow (300px) */}
      <div
        ref={layer300Ref}
        className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full will-change-transform"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(110, 231, 183, 0.22) 0%, rgba(52, 211, 153, 0.10) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.26) 0%, rgba(30, 41, 59, 0.14) 40%, transparent 70%)',
          filter: 'blur(36px)',
        }}
      />
    </div>
  );
};
