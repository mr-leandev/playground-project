"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Vec2 = { x: number; y: number };

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function distance(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export default function GardenPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [seedColor, setSeedColor] = useState<string>("#5eead4");

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: false })!;

    let width = 0;
    let height = 0;
    const seeds: Vec2[] = [];
    const branches: { from: Vec2; to: Vec2; life: number }[] = [];

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim() || "#0a0a0a";
      ctx.fillRect(0, 0, width, height);
    }

    function plantSeed(point: Vec2) {
      seeds.push(point);
      for (let i = 0; i < 8; i += 1) {
        const angle = randomBetween(0, Math.PI * 2);
        const len = randomBetween(2, 12);
        const to = { x: point.x + Math.cos(angle) * len, y: point.y + Math.sin(angle) * len };
        branches.push({ from: { ...point }, to, life: randomBetween(60, 180) });
      }
    }

    let lastTime = 0;
    function tick(t: number) {
      const dt = Math.min(33, t - lastTime);
      lastTime = t;

      // Fade background slightly for trails
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, width, height);

      // Draw and evolve branches
      ctx.lineCap = "round";
      for (let i = branches.length - 1; i >= 0; i -= 1) {
        const b = branches[i];
        const age = 1 - b.life / 180;
        const thickness = Math.max(0.5, 3 * (1 - age));
        ctx.strokeStyle = seedColor;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(b.from.x, b.from.y);
        ctx.lineTo(b.to.x, b.to.y);
        ctx.stroke();

        // chance to branch out further
        if (Math.random() < 0.15) {
          const dir = Math.atan2(b.to.y - b.from.y, b.to.x - b.from.x);
          const angle = dir + randomBetween(-0.9, 0.9);
          const len = randomBetween(4, 20);
          const start = { ...b.to };
          const end = { x: start.x + Math.cos(angle) * len, y: start.y + Math.sin(angle) * len };
          branches.push({ from: start, to: end, life: randomBetween(40, 160) });
        }

        b.life -= dt * 0.06;
        if (b.life <= 0) branches.splice(i, 1);
      }

      animationRef.current = requestAnimationFrame(tick);
    }

    function onPointerDown(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      plantSeed({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    function onPointerMove(e: PointerEvent) {
      if (e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const last = seeds[seeds.length - 1];
      if (!last || distance(last, p) > 12) plantSeed(p);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "r") {
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--background")
          .trim() || "#0a0a0a";
        ctx.fillRect(0, 0, width, height);
        seeds.splice(0, seeds.length);
        branches.splice(0, branches.length);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("keydown", onKey);
    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, [seedColor]);

  return (
    <div className="h-[100svh] w-full flex flex-col">
      <div className="flex items-center justify-between gap-4 p-4">
        <Link href="/" className="text-sm opacity-70 hover:opacity-100">← Home</Link>
        <div className="flex items-center gap-2">
          <label className="text-xs opacity-70">Color</label>
          <input
            aria-label="Seed color"
            type="color"
            value={seedColor}
            onChange={(e) => setSeedColor(e.target.value)}
            className="h-8 w-10 rounded border border-black/10 dark:border-white/10 bg-transparent"
          />
        </div>
      </div>
      <canvas ref={canvasRef} className="flex-1 w-full block" />
    </div>
  );
}


