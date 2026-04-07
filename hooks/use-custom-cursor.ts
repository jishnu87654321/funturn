'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function useCustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorX = useRef(-1000);
  const cursorY = useRef(-1000);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let currentX = cursorX.current;
    let currentY = cursorY.current;
    let trailX = cursorX.current;
    let trailY = cursorY.current;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      
      // Initialize instantly on first move
      if (currentX === -1000) {
        currentX = e.clientX;
        currentY = e.clientY;
        trailX = e.clientX;
        trailY = e.clientY;
      }
    };

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentX !== -1000) {
        // Interpolate for smooth trailing
        currentX += (cursorX.current - currentX) * 0.8;
        currentY += (cursorY.current - currentY) * 0.8;
        
        trailX += (cursorX.current - trailX) * 0.15;
        trailY += (cursorY.current - trailY) * 0.15;

        // 1. Draw large ambient interactive spotlight (Aura)
        const gradient = ctx.createRadialGradient(trailX, trailY, 0, trailX, trailY, 150);
        gradient.addColorStop(0, 'rgba(167, 139, 250, 0.12)'); // violet-400
        gradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(trailX - 150, trailY - 150, 300, 300);

        // 2. Draw trailing outer ring
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.5)'; // fuchsia/purple blend
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(trailX, trailY, 20, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Draw solid inner core dot
        ctx.fillStyle = 'rgba(232, 121, 249, 1)'; // fuchsia-400
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleWindowResize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleWindowResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return canvasRef;
}
