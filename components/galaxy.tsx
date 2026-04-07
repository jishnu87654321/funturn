'use client';

import { useEffect, useRef, useCallback } from 'react';

interface GalaxyProps {
  mouseRepulsion?: boolean;
  mouseInteraction?: boolean;
  density?: number;
  glowIntensity?: number;
  saturation?: number;
  hueShift?: number;
  twinkleIntensity?: number;
  rotationSpeed?: number;
  repulsionStrength?: number;
  autoCenterRepulsion?: number;
  starSpeed?: number;
  speed?: number;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  z: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  vx: number;
  vy: number;
}

export default function Galaxy({
  mouseRepulsion = true,
  mouseInteraction = true,
  density = 1,
  glowIntensity = 0.3,
  saturation = 0,
  hueShift = 140,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  repulsionStrength = 2,
  autoCenterRepulsion = 0,
  starSpeed = 0.5,
  speed = 1,
}: GalaxyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);
  const starsRef = useRef<Star[]>([]);

  const getStarColor = useCallback(
    (brightness: number) => {
      const h = hueShift;
      const s = saturation;
      const l = Math.floor(brightness * 60 + 30);
      return `hsl(${h}, ${s}%, ${l}%)`;
    },
    [hueShift, saturation]
  );

  const initStars = useCallback(
    (width: number, height: number) => {
      const count = Math.floor(width * height * 0.00005 * density);
      const stars: Star[] = [];
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.5) * Math.min(width, height) * 0.5;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const brightness = Math.random();
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          z: Math.random(),
          size: Math.random() * 4.5 + 2.0,
          opacity: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 2 + 0.5,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: getStarColor(brightness),
          vx: 0,
          vy: 0,
        });
      }
      starsRef.current = stars;
    },
    [density, getStarColor]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars(canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    if (mouseInteraction) {
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    }

    const animate = () => {
      timeRef.current += 0.016 * speed;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Dark galaxy background gradient
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.7);
      bg.addColorStop(0, 'rgba(20, 5, 40, 0.15)');
      bg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      starsRef.current.forEach((star) => {
        // Rotation around center
        const dx = star.baseX - cx;
        const dy = star.baseY - cy;
        const angleOffset = rotationSpeed * 0.001 * t * speed;
        const cosA = Math.cos(angleOffset);
        const sinA = Math.sin(angleOffset);
        const rx = cx + dx * cosA - dy * sinA;
        const ry = cy + dx * sinA + dy * cosA;

        // Auto center repulsion
        if (autoCenterRepulsion > 0) {
          const cdx = rx - cx;
          const cdy = ry - cy;
          const cd = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
          star.vx += (cdx / cd) * autoCenterRepulsion * 0.01;
          star.vy += (cdy / cd) * autoCenterRepulsion * 0.01;
        }

        // Mouse repulsion
        if (mouseRepulsion && mx > -1000) {
          const mdx = rx - mx;
          const mdy = ry - my;
          const md = Math.sqrt(mdx * mdx + mdy * mdy) || 1;
          const repZone = 120;
          if (md < repZone) {
            const force = ((repZone - md) / repZone) * repulsionStrength;
            star.vx += (mdx / md) * force * 0.5;
            star.vy += (mdy / md) * force * 0.5;
          }
        }

        // Velocity damping
        star.vx *= 0.9;
        star.vy *= 0.9;

        const finalX = rx + star.vx;
        const finalY = ry + star.vy;

        // Twinkle
        const twinkle =
          1 -
          twinkleIntensity * 0.5 +
          Math.sin(t * star.twinkleSpeed + star.twinkleOffset) *
            twinkleIntensity *
            0.5;

        const finalOpacity = star.opacity * twinkle;
        const size = star.size * (0.5 + star.z * 0.5);

        // Glow (Simplified for extreme performance)
        if (glowIntensity > 0 && star.z > 0.8) {
          ctx.beginPath();
          ctx.arc(finalX, finalY, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = star.color.replace('hsl', 'hsla').replace(')', `, ${finalOpacity * glowIntensity * 0.5})`);
          ctx.fill();
        }

        // Star dot
        ctx.beginPath();
        ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
        ctx.fillStyle = star.color
          .replace('hsl', 'hsla')
          .replace(')', `, ${finalOpacity})`);
        ctx.fill();
      });

      // Subtle galaxy arms overlay
      const arm = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.45);
      arm.addColorStop(0, `hsla(${hueShift}, 60%, 40%, 0.04)`);
      arm.addColorStop(0.4, `hsla(${hueShift + 20}, 50%, 30%, 0.02)`);
      arm.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = arm;
      ctx.fillRect(0, 0, w, h);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      if (mouseInteraction) {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [
    mouseRepulsion,
    mouseInteraction,
    glowIntensity,
    hueShift,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    speed,
    initStars,
  ]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: mouseInteraction ? 'auto' : 'none',
      }}
    />
  );
}
