'use client';

import { useCustomCursor } from '@/hooks/use-custom-cursor';

export function CustomCursor() {
  const canvasRef = useCustomCursor();

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
