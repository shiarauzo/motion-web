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
    <section className="flex h-full flex-col justify-between p-6 lg:p-8">
      <div>
        <p className="text-[12px] tracking-[0.16em] text-mute uppercase">
          For your agent
        </p>
        <p className="mt-4 font-serif text-2xl leading-snug text-pretty">
          {describeSpec(spec)}
        </p>
        <p className="mt-4 text-sm leading-6 text-mute text-pretty">
          Copy this, paste it in your agent, and name the element on your page.
          You do not need to write the motion yourself.
        </p>
        <p className="mt-3 font-serif text-lg tabular-nums tracking-tight">
          {spec.durationMs} ms
        </p>
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={onCopy}
          className="h-10 w-full rounded-full bg-ink text-sm text-paper transition-transform duration-150 hover:bg-accent active:scale-[0.96]"
        >
          {copied ? "Copied" : "Copy to agent"}
        </button>
        <details className="mt-4">
          <summary className="cursor-pointer py-2 text-sm text-mute">
            Show Spec
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-sheet p-4 font-mono text-[11px] leading-5 text-mute ring-1 ring-ink/10">
            {serializeSpec(spec)}
          </pre>
        </details>
      </div>
    </section>
  );
}
