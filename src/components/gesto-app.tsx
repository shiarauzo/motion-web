"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { catalogItem, CATALOG_NAMES, type CatalogName } from "@/domain/catalog";
import { serializeSpec } from "@/domain/serialize-spec";
import type { SketchSample, Spec } from "@/domain/spec";
import { specFromSketch } from "@/domain/spec-from-sketch";
import { MotionPreview } from "./motion-preview";

type Source = { kind: "catalog"; name: CatalogName } | { kind: "sketch" };

export function GestoApp() {
  const [source, setSource] = useState<Source>({ kind: "catalog", name: "bounce" });
  const [sketchSpec, setSketchSpec] = useState<Spec | null>(null);
  const [recording, setRecording] = useState(false);
  const [liveSample, setLiveSample] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const samplesRef = useRef<SketchSample[]>([]);
  const startedAtRef = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const spec = useMemo(() => {
    if (source.kind === "catalog") return catalogItem(source.name);
    return sketchSpec ?? catalogItem("bounce");
  }, [source, sketchSpec]);

  const stopRecording = useCallback(() => {
    setRecording((active) => {
      if (!active) return active;
      const samples = samplesRef.current;
      if (samples.length >= 2) {
        setSketchSpec(specFromSketch("sketch", samples));
        setSource({ kind: "sketch" });
      }
      setLiveSample(null);
      return false;
    });
  }, []);

  useEffect(() => {
    if (!recording) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      stopRecording();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording, stopRecording]);

  const startRecording = () => {
    samplesRef.current = [];
    startedAtRef.current = performance.now();
    setSketchSpec(null);
    setLiveSample(null);
    setRecording(true);
    setCopied(false);
  };

  const samplePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!recording) return;
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
    <div className="flex min-h-full flex-col bg-[#0c0c0c] text-[#ededed]">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.18em] text-white/40">
            GESTO
          </p>
          <h1 className="text-lg font-medium tracking-tight">
            Sketch or pick a Motion. Copy the Spec.
          </h1>
        </div>
        <button
          type="button"
          onClick={copySpec}
          className="h-10 border border-white/15 bg-white px-4 text-sm text-black hover:bg-lime-300"
        >
          {copied ? "Copied" : "Copy to agent"}
        </button>
      </header>

      <main className="grid flex-1 gap-px bg-white/10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_minmax(0,22rem)]">
        <section className="bg-[#0c0c0c] p-6">
          <h2 className="mb-4 font-mono text-[11px] tracking-[0.16em] text-white/40">
            Catalog
          </h2>
          <ul className="grid gap-3">
            {CATALOG_NAMES.map((name) => {
              const item = catalogItem(name);
              const selected =
                source.kind === "catalog" && source.name === name;
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      setSource({ kind: "catalog", name });
                      setCopied(false);
                    }}
                    className={`flex w-full items-center justify-between border px-3 py-3 text-left text-sm capitalize ${
                      selected
                        ? "border-lime-300 text-lime-300"
                        : "border-white/10 text-white/80 hover:border-white/30"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="bg-[#101010] p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-mono text-[11px] tracking-[0.16em] text-white/40">
              Sketch
            </h2>
            {recording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="h-9 border border-red-400 px-3 text-sm text-red-400"
              >
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="h-9 border border-white/15 px-3 text-sm hover:border-white/40"
              >
                Record
              </button>
            )}
          </div>
          <div
            ref={stageRef}
            onPointerDown={samplePointer}
            onPointerMove={samplePointer}
            role="application"
            aria-label="Sketch stage"
            className="relative aspect-square w-full max-w-[28rem] border border-white/10 bg-black"
          >
            {recording ? (
              <>
                <p className="absolute top-3 left-3 font-mono text-[11px] text-red-400">
                  Recording. Space stops.
                </p>
                {liveSample ? (
                  <div
                    className="absolute size-3 rounded-[3px] bg-lime-300"
                    style={{
                      left: liveSample.x - 6,
                      top: liveSample.y - 6,
                    }}
                  />
                ) : null}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <MotionPreview spec={spec} size={280} />
              </div>
            )}
          </div>
        </section>

        <section className="bg-[#0c0c0c] p-6">
          <h2 className="mb-4 font-mono text-[11px] tracking-[0.16em] text-white/40">
            Spec
          </h2>
          <p className="mb-3 text-sm text-white/50">
            Motion only. Name the Target when you paste this in the agent.
          </p>
          <pre className="max-h-[28rem] overflow-auto border border-white/10 bg-black p-4 font-mono text-[11px] leading-5 text-white/70">
            {hydrated ? serializeSpec(spec) : "Motion Spec v1"}
          </pre>
        </section>
      </main>
    </div>
  );
}
