"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { catalogItem, type CatalogName } from "@/domain/catalog";
import { serializeSpec } from "@/domain/serialize-spec";
import type { SketchSample, Spec } from "@/domain/spec";
import { specFromSketch } from "@/domain/spec-from-sketch";
import { CatalogList } from "./catalog-list";
import { MotionPreview } from "./motion-preview";
import { SpecPanel } from "./spec-panel";

type Source = { kind: "catalog"; name: CatalogName } | { kind: "sketch" };

export function GestoApp() {
  const [source, setSource] = useState<Source>({ kind: "catalog", name: "bounce" });
  const [sketchSpec, setSketchSpec] = useState<Spec | null>(null);
  const [sketching, setSketching] = useState(false);
  const [liveSample, setLiveSample] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [livePath, setLivePath] = useState<Array<{ x: number; y: number }>>([]);
  const [copied, setCopied] = useState(false);
  const [sketchNotice, setSketchNotice] = useState<string | null>(null);
  const [tokenSrc, setTokenSrc] = useState<string | null>(null);
  const samplesRef = useRef<SketchSample[]>([]);
  const startedAtRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    return () => {
      if (tokenSrc) URL.revokeObjectURL(tokenSrc);
    };
  }, [tokenSrc]);

  const spec = useMemo(() => {
    if (source.kind === "catalog") return catalogItem(source.name);
    return sketchSpec ?? catalogItem("bounce");
  }, [source, sketchSpec]);

  const stopSketch = useCallback(() => {
    setSketching((active) => {
      if (!active) return active;
      const samples = samplesRef.current;
      if (samples.length >= 2) {
        setSketchSpec(specFromSketch("sketch", samples));
        setSource({ kind: "sketch" });
        setSketchNotice(null);
      } else {
        setSketchNotice("Draw a path, then press Space.");
      }
      setLiveSample(null);
      setLivePath([]);
      return false;
    });
  }, []);

  useEffect(() => {
    if (!sketching) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      stopSketch();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sketching, stopSketch]);

  const startSketch = () => {
    samplesRef.current = [];
    startedAtRef.current = performance.now();
    setLiveSample(null);
    setLivePath([]);
    setSketchNotice(null);
    setSketching(true);
    setCopied(false);
  };

  const samplePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!sketching) return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    samplesRef.current.push({
      x,
      y,
      timeMs: performance.now() - startedAtRef.current,
    });
    setLiveSample({ x, y });
    setLivePath((path) => [...path, { x, y }]);
  };

  const beginSketchStroke = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!sketching) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    samplePointer(event);
  };

  const chooseToken = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setTokenSrc((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    event.target.value = "";
  };

  const copySpec = async () => {
    const text = serializeSpec(spec);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex min-h-full flex-col bg-paper text-ink">
      <header className="px-6 pt-8 pb-4 lg:px-10">
        <p className="font-serif text-3xl tracking-tight">Gesto</p>
        <h1 className="mt-2 max-w-xl text-lg text-mute text-balance">
          See how it moves. Then copy it for your page.
        </h1>
      </header>

      <main className="grid flex-1 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)_minmax(0,22rem)]">
        <section className="order-2 px-6 pb-8 lg:order-1 lg:px-10">
          <h2 className="mb-4 text-[12px] tracking-[0.16em] text-mute uppercase">
            Library
          </h2>
          <CatalogList
            selected={source.kind === "catalog" ? source.name : undefined}
            tokenSrc={tokenSrc}
            onSelect={(name) => {
              setSource({ kind: "catalog", name });
              setCopied(false);
            }}
          />
        </section>

        <section className="order-1 flex flex-col px-6 pb-6 lg:order-2 lg:px-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-[12px] tracking-[0.16em] text-mute uppercase">
              Canvas
            </h2>
            <div className="flex gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={chooseToken}
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="h-10 rounded-full px-4 text-sm ring-1 ring-ink/15 transition-transform duration-150 hover:bg-sheet active:scale-[0.96]"
              >
                Use image
              </button>
              {sketching ? (
                <button
                  type="button"
                  onClick={stopSketch}
                  className="h-10 rounded-full bg-accent px-4 text-sm text-paper transition-transform duration-150 active:scale-[0.96]"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startSketch}
                  className="h-10 rounded-full bg-ink px-4 text-sm text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.96]"
                >
                  Sketch
                </button>
              )}
            </div>
          </div>
          <div
            ref={stageRef}
            onPointerDown={beginSketchStroke}
            onPointerMove={samplePointer}
            role="application"
            aria-label="Sketch stage"
            className="relative aspect-square w-full max-w-[34rem] touch-none rounded-[28px] bg-sheet shadow-[0_1px_0_rgba(28,25,21,0.04),0_30px_60px_rgba(28,25,21,0.08)] ring-1 ring-ink/10"
          >
            {sketching ? (
              <>
                <p className="absolute top-5 left-5 text-sm text-accent">
                  Draw. Space stops.
                </p>
                {livePath.length > 1 ? (
                  <svg
                    className="pointer-events-none absolute inset-0 text-ink/50"
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  >
                    <path
                      d={livePath
                        .map((point, index) =>
                          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : null}
                {liveSample ? (
                  tokenSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tokenSrc}
                      alt=""
                      className="absolute size-8 rounded-sm object-cover outline outline-1 outline-black/10"
                      style={{
                        left: liveSample.x - 16,
                        top: liveSample.y - 16,
                      }}
                    />
                  ) : (
                    <div
                      className="absolute size-3 rounded-sm bg-ink"
                      style={{
                        left: liveSample.x - 6,
                        top: liveSample.y - 6,
                      }}
                    />
                  )
                ) : null}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <MotionPreview spec={spec} size={320} tokenSrc={tokenSrc} />
              </div>
            )}
          </div>
          {sketchNotice ? (
            <p className="mt-3 text-sm text-accent">{sketchNotice}</p>
          ) : null}
        </section>

        <div className="order-3 lg:order-3">
          {hydrated ? (
            <SpecPanel spec={spec} copied={copied} onCopy={copySpec} />
          ) : (
            <section className="p-6">
              <p className="text-[12px] tracking-[0.16em] text-mute uppercase">
                For your agent
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
