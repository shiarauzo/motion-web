import { catalogItem, CATALOG_NAMES, type CatalogName } from "@/domain/catalog";
import { MotionPreview } from "./motion-preview";

type CatalogListProps = {
  selected?: CatalogName;
  onSelect: (name: CatalogName) => void;
  tokenSrc?: string | null;
};

export function CatalogList({ selected, onSelect, tokenSrc }: CatalogListProps) {
  return (
    <ul className="grid gap-4">
      {CATALOG_NAMES.map((name) => {
        const item = catalogItem(name);
        const isSelected = selected === name;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onSelect(name)}
              className={`flex w-full flex-col items-stretch rounded-[20px] p-2 text-left transition-transform duration-150 active:scale-[0.96] ${
                isSelected
                  ? "bg-sheet shadow-[0_1px_0_rgba(28,25,21,0.06),0_18px_40px_rgba(28,25,21,0.08)] ring-1 ring-ink/15"
                  : "bg-sheet/70 ring-1 ring-ink/10 hover:bg-sheet hover:shadow-[0_10px_28px_rgba(28,25,21,0.06)]"
              }`}
            >
              <div className="pointer-events-none flex aspect-square items-center justify-center rounded-xl bg-[#f7f1e8]">
                <MotionPreview spec={item} size={140} tokenSrc={tokenSrc} />
              </div>
              <span className="mt-3 px-2 pb-1 font-serif text-lg capitalize tracking-tight">
                {item.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
