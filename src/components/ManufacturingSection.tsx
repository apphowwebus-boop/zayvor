import { ArrowUpRight } from 'lucide-react';
import { CUSTOMIZATION_CAPABILITIES, MANUFACTURING_STEPS } from '../data/catalog';
import { ProtectedMedia } from './ProtectedMedia';

interface ManufacturingSectionProps {
  onOpenQuote: () => void;
}

export function ManufacturingSection({ onOpenQuote }: ManufacturingSectionProps) {
  return (
    <section
      id="manufacturing"
      className="bg-[#0E0F12] text-white border-t border-white/10"
      aria-labelledby="manufacturing-heading"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16 lg:py-24">
        {/* Asymmetric Split: Atelier Photography + Complete Manufacturing Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left: High-Craft Industrial Atelier Image rendered via ProtectedMedia */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full overflow-hidden bg-[#181A20]">
            <ProtectedMedia
              src="/src/assets/images/oem_atelier_v2_1794912980296.jpg"
              alt="Industrial embroidery machine stitching the ZAYVOR Sports Industries logo onto pearl-weave Gi fabric"
              objectFit="cover"
              objectPosition="center"
              className="w-full h-full min-h-[340px]"
            />
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#0E0F12]/80 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#E5B84B] mb-1">
                In-House Production Floor
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed">
                Multi-head Tajima embroidery, woven neck labels, Italian-ink sublimation, and AQL
                stitching inspection under one roof.
              </p>
            </div>
          </div>

          {/* Right: Customization & 6-Step Production Process */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#E5B84B] mb-2">
                OEM &amp; Private Label Partner
              </p>
              <h2
                id="manufacturing-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"
                style={{ textWrap: 'balance' }}
              >
                Complete Combat Apparel Manufacturing
              </h2>
              <p className="text-sm sm:text-[15px] text-zinc-300 leading-relaxed max-w-2xl mb-8">
                Launch or scale your martial arts brand with direct factory execution—from raw
                pearl-weave cotton sourcing and custom tech-pack grading to private-label woven
                packaging and worldwide air or sea export.
              </p>

              {/* Customization Options Grid */}
              <div className="mb-10">
                <h3 className="text-xs font-mono uppercase tracking-[0.12em] text-zinc-400 mb-3">
                  Customization Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-white/12">
                  {CUSTOMIZATION_CAPABILITIES.map((cap) => (
                    <div
                      key={cap.id}
                      className="py-4 pr-4 border-b border-white/12"
                    >
                      <div className="text-sm font-semibold text-white">{cap.title}</div>
                      <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{cap.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6-Step Production Line */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-[0.12em] text-zinc-400 mb-3">
                  6-Stage Factory Workflow
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-white/12">
                  {MANUFACTURING_STEPS.map((item) => (
                    <div
                      key={item.step}
                      className="py-3.5 border-b border-white/12 flex items-start gap-3"
                    >
                      <span className="font-mono text-xs font-semibold text-[#E5B84B] tabular-nums pt-0.5 shrink-0">
                        {item.step}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/12 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-zinc-400 font-mono tabular-nums">
                MOQ from 25 pcs · Sample turnaround 7–10 business days
              </div>
              <button
                type="button"
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9931E] hover:bg-[#D9A32A] text-[#111215] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Start Custom Order</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
