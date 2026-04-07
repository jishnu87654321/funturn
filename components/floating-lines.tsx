'use client';

import { useEffect, useRef } from 'react';

interface FloatingLinesProps {
  enabledWaves?: string[];
  lineCount?: number;
  lineDistance?: number;
  bendRadius?: number;
  bendStrength?: number;
  interactive?: boolean;
  parallax?: boolean;
}

export function FloatingLines({
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = 5,
  lineDistance = 5,
  bendRadius = 250,
  bendStrength = -0.5,
  interactive = true,
  parallax = true,
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    const mouse = { x: -1000, y: -1000 };
    const targetMouse = { x: -1000, y: -1000 };
    
    // Parallax logic
    const scroll = { y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    };

    const handleScroll = () => {
      scroll.y = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (targetMouse.x - mouse.x) * 0.1;
      mouse.y += (targetMouse.y - mouse.y) * 0.1;

      time += 0.0008; // Significantly decreased horizontal speed

      const drawWaveRegion = (baseY: number, lineIndex: number, phaseOffset: number, color: string) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25;

        // Apply parallax to base Y
        const parallaxOffset = parallax ? scroll.y * 0.2 : 0;
        const actualBaseY = baseY - parallaxOffset;

        for (let x = 0; x <= width; x += 15) {
          const wave1 = Math.sin(x * 0.002 + time + phaseOffset) * 45;
          const wave2 = Math.cos(x * 0.001 - time * 0.5 + phaseOffset) * 20; // Slower secondary wave
          
          let y = actualBaseY + (lineIndex * lineDistance) + wave1 + wave2;

          // Mouse interaction (Magnetic Bend)
          if (interactive) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bendRadius) {
              // Smooth gaussian falloff for bend
              const force = Math.max(0, 1 - (dist / bendRadius));
              // if bendStrength is negative, it repulses away from mouse
              y -= bendStrength * dy * force;
            }
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      };

      // Fuchia, Violet, Purple matching the theme (subtle opacity)
      const colors = [
        'rgba(217, 70, 239, 0.15)', // fuchsia
        'rgba(167, 139, 250, 0.15)', // violet
        'rgba(139, 92, 246, 0.15)', // purple
        'rgba(192, 132, 252, 0.15)', // light purple
        'rgba(124, 58, 237, 0.15)'   // dark violet
      ];

      if (enabledWaves.includes('top')) {
        for (let i = 0; i < lineCount; i++) {
          drawWaveRegion(height * 0.15, i, 0 + i * 0.15, colors[i % colors.length]);
        }
      }
      if (enabledWaves.includes('middle')) {
        for (let i = 0; i < lineCount; i++) {
          drawWaveRegion(height * 0.5, i, 2 + i * 0.15, colors[(i + 1) % colors.length]);
        }
      }
      if (enabledWaves.includes('bottom')) {
        for (let i = 0; i < lineCount; i++) {
          drawWaveRegion(height * 0.85, i, 4 + i * 0.15, colors[(i + 2) % colors.length]);
        }
      }

      requestAnimationFrame(animate);
    };

    let af = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(af);
    };
  }, [enabledWaves, lineCount, lineDistance, bendRadius, bendStrength, interactive, parallax]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}
