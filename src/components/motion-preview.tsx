import { pathToSvgD } from "@/domain/path-svg";
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

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="absolute inset-0 text-white/20"
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
          className="gesto-token absolute top-0 left-0 size-8 rounded-sm object-cover"
          style={{
            offsetPath: `path("${d}")`,
            animationDuration: `${spec.durationMs}ms`,
          }}
        />
      ) : (
        <div
          className="gesto-token absolute top-0 left-0 size-3 rounded-[3px] bg-lime-300"
          style={{
            offsetPath: `path("${d}")`,
            animationDuration: `${spec.durationMs}ms`,
          }}
        />
      )}
    </div>
  );
}
