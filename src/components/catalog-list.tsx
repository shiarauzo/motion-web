import { catalogItem, CATALOG_NAMES, type CatalogName } from "@/domain/catalog";
import { MotionPreview } from "./motion-preview";

type CatalogListProps = {
  selected?: CatalogName;
  onSelect: (name: CatalogName) => void;
  tokenSrc?: string | null;
};

export function CatalogList({ selected, onSelect, tokenSrc }: CatalogListProps) {
  return (
    <ul className="grid gap-3">
      {CATALOG_NAMES.map((name) => {
        const item = catalogItem(name);
        const isSelected = selected === name;
        return (
          <li key={name}>
            <button
              type="button"
              onClick={() => onSelect(name)}
              className={`flex w-full flex-col items-stretch border p-3 text-left ${
                isSelected
                  ? "border-lime-300 text-lime-300"
                  : "border-white/10 text-white/80 hover:border-white/30"
              }`}
            >
              <div className="pointer-events-none flex aspect-square items-center justify-center bg-black">
                <MotionPreview spec={item} size={140} tokenSrc={tokenSrc} />
              </div>
              <span className="mt-3 text-sm capitalize">{item.name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
