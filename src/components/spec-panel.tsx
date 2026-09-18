import { describeSpec } from "@/domain/describe-spec";
import { serializeSpec } from "@/domain/serialize-spec";
import type { Spec } from "@/domain/spec";

type SpecPanelProps = {
  spec: Spec;
  copied: boolean;
  onCopy: () => void;
};

export function SpecPanel({ spec, copied, onCopy }: SpecPanelProps) {
  return (
    <section className="bg-[#0c0c0c] p-6">
      <h2 className="mb-4 font-mono text-[11px] tracking-[0.16em] text-white/40">
        Spec
      </h2>
      <p className="text-base text-white/85">{describeSpec(spec)}</p>
      <p className="mt-3 text-sm text-white/50">
        Copy this, paste it in your agent, and name the element on your page.
      </p>
      <button
        type="button"
        onClick={onCopy}
        className="mt-5 h-10 w-full border border-white/15 bg-white text-sm text-black hover:bg-lime-300"
      >
        {copied ? "Copied" : "Copy to agent"}
      </button>
      <details className="mt-5 border border-white/10 bg-black">
        <summary className="cursor-pointer px-4 py-3 text-sm text-white/60">
          Show Spec
        </summary>
        <pre className="max-h-72 overflow-auto px-4 pb-4 font-mono text-[11px] leading-5 text-white/70">
          {serializeSpec(spec)}
        </pre>
      </details>
    </section>
  );
}
