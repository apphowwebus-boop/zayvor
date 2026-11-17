import { Plus } from 'lucide-react';
import { ProductItem } from '../types/catalog';
import { ProtectedMedia } from './ProtectedMedia';

interface ProductCardProps {
  product: ProductItem;
  onInspect: (product: ProductItem) => void;
  onQuickAdd: (product: ProductItem) => void;
}

export function ProductCard({ product, onInspect, onQuickAdd }: ProductCardProps) {
  return (
    <article className="group flex flex-col transition-transform duration-200 hover:-translate-y-0.5 select-none">
      {/* Studio Model Image Container rendered via ProtectedMedia canvas shield */}
      <div
        className="relative aspect-[3/4] w-full bg-[#ECEBE8] overflow-hidden mb-4"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        <button
          type="button"
          onClick={() => onInspect(product)}
          className="block w-full h-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111215]"
          aria-label={`View specifications for ${product.name}`}
        >
          <ProtectedMedia
            src={product.image}
            alt={product.imageAlt}
            objectFit="cover"
            objectPosition="top"
            fallbackTitle={product.name}
            className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.025]"
          />
        </button>

        {/* Quiet Top-Left Single Text Tag */}
        {product.badge && (
          <span className="pointer-events-none absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#111215]">
            {product.badge}
          </span>
        )}

        {/* Quick-Add Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(product);
          }}
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#111215]/90 hover:bg-[#111215] text-white text-xs font-medium tracking-wide backdrop-blur-sm transition-all opacity-95 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 rounded-sm cursor-pointer whitespace-nowrap shrink-0"
          aria-label={`Add ${product.name} to quote bag`}
        >
          <Plus className="w-3.5 h-3.5 text-[#E5B84B]" aria-hidden="true" />
          <span>Add to Quote</span>
        </button>
      </div>

      {/* Unboxed Clean Metadata (Category · GSM · Division) */}
      <div className="flex items-center justify-between gap-2 text-[12px] text-zinc-500 mb-1">
        <div className="flex items-center gap-1.5 truncate">
          <span className="uppercase tracking-[0.06em] font-medium text-zinc-600">
            {product.categoryLabel}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{product.gsm}</span>
          <span aria-hidden="true">·</span>
          <span>{product.division}</span>
        </div>
        <span
          className="w-3 h-3 rounded-full border border-black/20 shrink-0"
          style={{ backgroundColor: product.colorHex }}
          title={product.colorway}
        />
      </div>

      {/* Product Title */}
      <h3 className="text-[16px] font-semibold text-[#111215] leading-snug mb-1.5">
        <button
          type="button"
          onClick={() => onInspect(product)}
          className="text-left hover:underline underline-offset-4 decoration-[#C9931E] cursor-pointer"
        >
          {product.name}
        </button>
      </h3>

      {/* Manufacturing Baseline (No Prices) */}
      <div className="flex items-baseline justify-between gap-3 text-[13px] tabular-nums">
        <span className="font-medium text-zinc-700">
          Custom OEM &amp; Private Label
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          MOQ {product.moq} pcs · {product.sku}
        </span>
      </div>
    </article>
  );
}
