import { Check, Minus, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductItem } from '../types/catalog';
import { ProtectedMedia } from './ProtectedMedia';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToQuote: (
    product: ProductItem,
    size: string,
    customization: string,
    quantity: number,
  ) => void;
}

export function ProductModal({ product, onClose, onAddToQuote }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedCustomization, setSelectedCustomization] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(25);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[1] || product.sizes[0]);
      setSelectedCustomization(product.customizationMethods[0]);
      setQuantity(product.moq);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const activeTier =
    quantity >= 500
      ? product.productionTiers[3]
      : quantity >= 100
        ? product.productionTiers[2]
        : quantity >= product.moq
          ? product.productionTiers[1]
          : product.productionTiers[0];

  const handleSubmit = () => {
    onAddToQuote(product, selectedSize, selectedCustomization, quantity);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-6 overflow-y-auto select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FAF9F7] text-[#111215] sm:rounded-sm overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 max-h-screen sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product specification"
          className="absolute top-4 right-4 z-30 w-10 h-10 inline-flex items-center justify-center bg-white/90 hover:bg-white text-[#111215] border border-black/10 rounded-sm cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Protected Model Photography */}
        <div
          className="lg:col-span-6 bg-[#ECEBE8] relative aspect-[3/4] lg:aspect-auto lg:h-full max-h-[420px] lg:max-h-none overflow-hidden"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        >
          <ProtectedMedia
            src={product.image}
            alt={product.imageAlt}
            objectFit="cover"
            objectPosition="top"
            fallbackTitle={product.name}
            className="w-full h-full"
          />
        </div>

        {/* Right: Contiguous OEM Spec & Quote Module (No Prices) */}
        <div className="lg:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-2">
              <span className="uppercase text-zinc-700 font-semibold">{product.sku}</span>
              <span aria-hidden="true">·</span>
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{product.division}</span>
            </div>

            <h2 id="pdp-title" className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#111215] mb-2">
              {product.name}
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed mb-4">
              {product.description}
            </p>

            <div className="py-3 border-y border-black/10 text-xs text-zinc-700 flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
              <span>
                <strong className="font-semibold text-[#111215]">Fabric:</strong> {product.fabricSpec}
              </span>
              <span className="font-mono">
                <strong className="font-sans font-semibold text-[#111215]">Weight:</strong> {product.gsm}
              </span>
              <span>
                <strong className="font-semibold text-[#111215]">Color:</strong> {product.colorway}
              </span>
            </div>

            {/* Production Volume & Lead Time Tiers (No Prices) */}
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Production Batch &amp; Lead Time
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-black/10 bg-white divide-y sm:divide-y-0 sm:divide-x divide-black/10">
                {product.productionTiers.map((tier) => {
                  const isCurrent = tier.range === activeTier.range;
                  return (
                    <div
                      key={tier.range}
                      className={`p-2.5 ${isCurrent ? 'bg-[#111215] text-white' : ''}`}
                    >
                      <div className={`text-[11px] ${isCurrent ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {tier.range}
                      </div>
                      <div className="font-mono text-xs font-semibold tabular-nums mt-1">
                        {tier.leadTime}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider text-zinc-500">
                  Sample / Lead Size
                </span>
                <span className="text-zinc-500">Mixed sizes supported on bulk orders</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs font-mono font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-[#111215] text-white border-[#111215]'
                          : 'bg-white text-[#111215] border-black/15 hover:border-black/40'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Selector */}
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Branding &amp; Customization Option
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.customizationMethods.map((method) => {
                  const active = selectedCustomization === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setSelectedCustomization(method)}
                      className={`flex items-center justify-between px-3 py-2 text-xs font-medium text-left rounded-sm border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#111215] text-white border-[#111215]'
                          : 'bg-white text-[#111215] border-black/15 hover:border-black/40'
                      }`}
                    >
                      <span className="truncate">{method}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#E5B84B] shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quantity & Primary CTA (No Prices) */}
          <div className="pt-4 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between border border-black/15 bg-white rounded-sm h-11 px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - (q > 10 ? 5 : 1)))}
                aria-label="Decrease quantity"
                className="w-8 h-8 inline-flex items-center justify-center text-zinc-700 hover:bg-black/5 rounded-sm cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="px-3 text-center">
                <span className="font-mono text-sm font-semibold tabular-nums">{quantity}</span>
                <span className="text-[11px] text-zinc-500 ml-1">pcs</span>
              </div>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + (q >= 10 ? 5 : 1))}
                aria-label="Increase quantity"
                className="w-8 h-8 inline-flex items-center justify-center text-zinc-700 hover:bg-black/5 rounded-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 h-11 px-6 bg-[#C9931E] hover:bg-[#D9A32A] text-[#111215] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer whitespace-nowrap tabular-nums"
            >
              Add to Quote Bag · {quantity} pcs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
