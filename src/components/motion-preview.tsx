"use client";

import { useEffect, useState } from "react";
import { pathToSvgD } from "@/domain/path-svg";
import { pointAtTime } from "@/domain/point-at-time";
import type { Spec } from "@/domain/spec";

type MotionPreviewProps = {
  spec: Spec;
  size?: number;
  tokenSrc?: string | null;
};

export function MotionPreview({
  spec,
  size = 220,
  tokenSrc,
}: MotionPreviewProps) {
  const d = pathToSvgD(spec.path, size, size);
  const point = useSpecPoint(spec);
  const token = tokenSrc ? 32 : 12;
  const x = point.x * size - token / 2;
  const y = point.y * size - token / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 text-ink/25"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <path d={d} fill="none" stroke="currentColor" strokeWidth="1.25" />
      </svg>
      {tokenSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tokenSrc}
          alt=""
          className="gesto-token absolute top-0 left-0 size-8 rounded-sm object-cover outline outline-1 outline-black/10"
          style={{ transform: `translate(${x}px, ${y}px)` }}
        />
      ) : (
        <div
          className="gesto-token absolute top-0 left-0 size-3 rounded-sm bg-ink"
          style={{ transform: `translate(${x}px, ${y}px)` }}
        />
      )}
    </div>
  );
}

function useSpecPoint(spec: Spec) {
  const [point, setPoint] = useState(() => pointAtTime(spec.path, 0));

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPoint(pointAtTime(spec.path, 0));
      return;
    }

    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = ((now - started) % spec.durationMs) / spec.durationMs;
      setPoint(pointAtTime(spec.path, t));
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [spec]);

  return point;
}
