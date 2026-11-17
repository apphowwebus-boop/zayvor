import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { HERO_SLIDES } from '../data/catalog';
import { ProductCategory } from '../types/catalog';
import { ProtectedMedia } from './ProtectedMedia';

interface HeroCarouselProps {
  onSelectCategory: (category: ProductCategory) => void;
  onOpenQuote: () => void;
}

const SLIDE_LABELS = ['Women', 'Men', 'Men & Women'];

export function HeroCarousel({ onSelectCategory, onOpenQuote }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const currentSlide = HERO_SLIDES[activeIndex];

  const handlePrimaryClick = () => {
    onSelectCategory(currentSlide.primaryCategory);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="top"
      aria-label="Featured Athletic Campaigns"
      className="relative w-full h-[540px] sm:h-[600px] lg:h-[680px] bg-[#0E0F12] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide Images rendered via ProtectedMedia */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-500 ease-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <ProtectedMedia
              src={slide.image}
              alt={slide.imageAlt}
              objectFit="cover"
              objectPosition="top"
              className="w-full h-full"
            />
            {/* Measured gradient scrim */}
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-[#0B0C0F]/85 via-[#0B0C0F]/35 to-transparent"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#0B0C0F]/85 via-transparent to-[#0B0C0F]/20"
              aria-hidden="true"
            />
          </div>
        );
      })}

      {/* Editorial Content Overlay */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col justify-end pb-12 sm:pb-16">
        <div className="max-w-xl">
          <p className="text-xs font-mono tracking-[0.14em] uppercase text-[#E5B84B] mb-3">
            {currentSlide.divisionLabel}
          </p>
          <h1
            className="font-display text-white font-bold tracking-tight leading-[1.02] mb-4"
            style={{
              fontSize: 'clamp(2.35rem, 4.4vw, 4rem)',
              textWrap: 'balance',
            }}
          >
            {currentSlide.headline}
          </h1>
          <p className="text-sm sm:text-[15px] text-zinc-200 leading-relaxed max-w-lg mb-7">
            {currentSlide.subheadline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9931E] hover:bg-[#D9A32A] text-[#111215] text-xs font-bold tracking-wider uppercase rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>{currentSlide.primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenQuote}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-sm text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9931E]"
            >
              <span>{currentSlide.secondaryCtaLabel}</span>
            </button>
          </div>
        </div>

        {/* Slide Switcher Controls */}
        <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-5 overflow-x-auto">
            {HERO_SLIDES.map((slide, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group flex items-center gap-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span
                    className={`font-mono tabular-nums text-[11px] ${
                      active ? 'text-[#E5B84B]' : 'text-zinc-500'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className={active ? 'underline underline-offset-4 decoration-[#C9931E]' : ''}>
                    {SLIDE_LABELS[idx]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
              }
              aria-label="Previous slide"
              className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-white/20 bg-black/30 text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-white/20 bg-black/30 text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
