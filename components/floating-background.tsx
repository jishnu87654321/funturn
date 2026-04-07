'use client';

import { useEffect, useRef } from 'react';

export function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const lines: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
    }> = [];

    // Create lines (Restored glassy thin lines)
    for (let i = 0; i < 6; i++) {
      lines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        length: Math.random() * 120 + 80,
      });
    }

    const handleWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        line.x += line.vx;
        line.y += line.vy;

        // Wrap around smoothly
        if (line.x < -line.length) line.x = canvas.width;
        if (line.x > canvas.width + line.length) line.x = -line.length;
        if (line.y < -line.length) line.y = canvas.height;
        if (line.y > canvas.height + line.length) line.y = -line.length;

        // Draw line
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y + line.length);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleWindowResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
    />
  );
}
