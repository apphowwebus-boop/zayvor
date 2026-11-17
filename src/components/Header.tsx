import { Menu, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { ProductCategory } from '../types/catalog';
import { ZayvorLogo } from './ZayvorLogo';

interface HeaderProps {
  bagCount: number;
  onOpenBag: () => void;
  onNavigateCategory: (category: ProductCategory) => void;
}

export function Header({ bagCount, onOpenBag, onNavigateCategory }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryJump = (category: ProductCategory) => {
    onNavigateCategory(category);
    setMobileMenuOpen(false);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnchorJump = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0F12]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Logo (exact zayvorlogo.png) */}
        <a
          href="#top"
          className="whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9931E]"
          aria-label="Zayvor Sports Industries Home"
        >
          <ZayvorLogo size="md" />
        </a>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-[0.02em] text-zinc-300"
        >
          <button
            type="button"
            onClick={() => handleCategoryJump('all')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#C9931E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('gis')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#C9931E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            BJJ Gis
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('rash-guards')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#C9931E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Rash Guards
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('no-gi-shorts')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#C9931E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Shorts &amp; Spats
          </button>
          <button
            type="button"
            onClick={() => handleAnchorJump('manufacturing')}
            className="hover:text-white hover:underline underline-offset-4 decoration-[#C9931E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            OEM Partner
          </button>
        </nav>

        {/* Zone 3: 1 primary action + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenBag}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9931E] hover:bg-[#D9A32A] text-[#111215] text-xs font-bold tracking-wide transition-colors rounded-sm whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#111215]" aria-hidden="true" />
            <span className="tabular-nums">
              {bagCount > 0 ? `Quote Bag (${bagCount})` : 'Get a Quote'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-sm cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0E0F12] px-4 py-4 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => handleCategoryJump('all')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            All Collections
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('gis')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            BJJ / Jiu Jitsu Gis
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('rash-guards')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            Rash Guards
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('no-gi-shorts')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            No-Gi Shorts
          </button>
          <button
            type="button"
            onClick={() => handleCategoryJump('spats')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            Spats / Compression Pants
          </button>
          <button
            type="button"
            onClick={() => handleAnchorJump('manufacturing')}
            className="text-left py-2.5 px-2 text-sm font-medium text-zinc-200 hover:bg-white/5 rounded-sm"
          >
            OEM &amp; Custom Manufacturing
          </button>
        </div>
      )}
    </header>
  );
}
