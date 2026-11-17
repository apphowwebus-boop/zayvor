import { Search, ShieldAlert, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { ManufacturingSection } from './components/ManufacturingSection';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import { ZayvorLogo } from './components/ZayvorLogo';
import { CATEGORY_TABS, PRODUCTS } from './data/catalog';
import { GenderDivision, ProductCategory, ProductItem, QuoteBagItem } from './types/catalog';

const MANUFACTURING_PILLARS = [
  { num: '01', title: 'Direct Manufacturer', detail: 'In-house cutting, stitching & QC' },
  { num: '02', title: 'OEM & Private Label', detail: 'Custom embroidery, sublimation & woven tags' },
  { num: '03', title: 'Low MOQ & Bulk Orders', detail: 'Flexible runs starting from 25 pieces' },
  { num: '04', title: 'Worldwide Shipping', detail: 'Door-to-door air & sea export logistics' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [divisionFilter, setDivisionFilter] = useState<'All' | GenderDivision>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [quoteBag, setQuoteBag] = useState<QuoteBagItem[]>([]);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [privacyShield, setPrivacyShield] = useState(false);

  // Content, image download, copy-paste, and screenshot shortcut protection
  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
    };

    const triggerShield = () => {
      setPrivacyShield(true);
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText('').catch(() => {});
      }
      window.setTimeout(() => setPrivacyShield(false), 2400);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    const onCopyOrCut = (e: ClipboardEvent) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const onSelectStart = (e: Event) => {
      if (!isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const onBeforePrint = () => {
      triggerShield();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlOrMeta = e.ctrlKey || e.metaKey;

      // Block PrintScreen and OS snipping shortcuts (Win+Shift+S, Cmd+Shift+3/4/5, Ctrl+Shift+S)
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey) ||
        (ctrlOrMeta && e.shiftKey && (key === 's' || key === '3' || key === '4' || key === '5'))
      ) {
        e.preventDefault();
        triggerShield();
        return;
      }

      // Block Save, Print, View Source, DevTools shortcuts
      if (
        e.key === 'F12' ||
        (ctrlOrMeta && (key === 's' || key === 'p' || key === 'u')) ||
        (ctrlOrMeta && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        e.preventDefault();
        if (key === 'p') triggerShield();
        return;
      }

      // Block Copy / Select All outside editable inputs
      if (ctrlOrMeta && (key === 'c' || key === 'x' || key === 'a') && !isEditableTarget(e.target)) {
        e.preventDefault();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        triggerShield();
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        setPrivacyShield(true);
      } else {
        window.setTimeout(() => setPrivacyShield(false), 250);
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('copy', onCopyOrCut);
    document.addEventListener('cut', onCopyOrCut);
    document.addEventListener('selectstart', onSelectStart);
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('copy', onCopyOrCut);
      document.removeEventListener('cut', onCopyOrCut);
      document.removeEventListener('selectstart', onSelectStart);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PRODUCTS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesDivision =
        divisionFilter === 'All' || item.division === divisionFilter || item.division === 'Unisex';
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.colorway.toLowerCase().includes(q) ||
        item.fabricSpec.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q);
      return matchesCategory && matchesDivision && matchesSearch;
    });
  }, [activeCategory, divisionFilter, searchQuery]);

  const totalBagUnits = useMemo(
    () => quoteBag.reduce((sum, item) => sum + item.quantity, 0),
    [quoteBag],
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  const handleAddToQuote = (
    product: ProductItem,
    size: string,
    customization: string,
    quantity: number,
  ) => {
    const key = `${product.id}-${size}-${customization}`;
    setQuoteBag((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { key, product, size, customization, quantity }];
    });
    showToast(`Added ${quantity} pcs of ${product.name} to Quote Bag`);
  };

  const handleQuickAdd = (product: ProductItem) => {
    handleAddToQuote(
      product,
      product.sizes[1] || product.sizes[0],
      product.customizationMethods[0],
      product.moq,
    );
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setQuoteBag((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const handleRemoveItem = (key: string) => {
    setQuoteBag((prev) => prev.filter((item) => item.key !== key));
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setDivisionFilter('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#111215] select-none">
      <Header
        bagCount={quoteBag.length}
        onOpenBag={() => setIsQuoteOpen(true)}
        onNavigateCategory={(cat) => {
          setActiveCategory(cat);
          setDivisionFilter('All');
        }}
      />

      <main className="flex-1">
        {/* 1. Three-Slide Athletic Hero Carousel (Women / Men / Duo) */}
        <HeroCarousel
          onSelectCategory={(cat) => {
            setActiveCategory(cat);
            setDivisionFilter('All');
          }}
          onOpenQuote={() => setIsQuoteOpen(true)}
        />

        {/* 2. 4-Column Hairline Manufacturing Pillars Strip */}
        <section
          aria-label="Manufacturing Guarantees"
          className="border-b border-black/10 bg-white"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-black/10">
            {MANUFACTURING_PILLARS.map((pillar) => (
              <div key={pillar.num} className="py-5 sm:px-6 first:sm:pl-0 last:sm:pr-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="font-mono text-xs font-semibold text-[#C9931E] tabular-nums">
                    {pillar.num}
                  </span>
                  <h2 className="text-sm font-semibold text-[#111215] tracking-tight">
                    {pillar.title}
                  </h2>
                </div>
                <p className="text-xs text-zinc-500">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Featured Product Catalog Grid */}
        <section
          id="catalog"
          aria-labelledby="catalog-heading"
          className="max-w-[1400px] mx-auto px-4 sm:px-8 py-14 lg:py-20"
        >
          {/* Catalog Heading & Division Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500 mb-2">
                BJJ &amp; No-Gi Collections
              </p>
              <h2
                id="catalog-heading"
                className="font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#111215] leading-none"
                style={{ textWrap: 'balance' }}
              >
                Manufactured Combat Sportswear
              </h2>
            </div>

            {/* Search & Division Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center p-1 bg-[#ECEBE8] rounded-sm">
                {(['All', 'Women', 'Men'] as const).map((div) => {
                  const active = divisionFilter === div;
                  return (
                    <button
                      key={div}
                      type="button"
                      onClick={() => setDivisionFilter(div)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-[#111215] shadow-xs'
                          : 'text-zinc-600 hover:text-[#111215]'
                      }`}
                    >
                      {div}
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 sm:flex-initial sm:w-64">
                <Search
                  className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gis, Rash Guards, GSM..."
                  aria-label="Search Zayvor product catalog"
                  className="w-full h-9 pl-8 pr-8 text-xs bg-white border border-black/15 rounded-sm focus:outline-none focus:border-[#111215]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#111215] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Product Categories"
            className="flex items-center gap-2 overflow-x-auto py-5 border-b border-black/8 mb-8"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#111215] text-white'
                      : 'bg-white text-zinc-700 border border-black/10 hover:border-black/30 hover:text-[#111215]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1.5 font-mono tabular-nums text-[11px] ${
                      active ? 'text-[#E5B84B]' : 'text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Uniform 3-Column Studio Model Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onInspect={(p) => setSelectedProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-black/10 rounded-sm">
              <p className="text-base font-semibold text-[#111215] mb-1">
                No matching styles found
              </p>
              <p className="text-xs text-zinc-500 mb-5">
                Try clearing your search or switching back to all product categories.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#111215] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* 4. OEM Craftsmanship & Custom Manufacturing Atelier */}
        <ManufacturingSection onOpenQuote={() => setIsQuoteOpen(true)} />
      </main>

      {/* Minimalist Brand Footer */}
      <footer className="bg-[#0B0C0F] text-zinc-400 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <ZayvorLogo size="lg" />
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mt-4">
              Direct manufacturer and global supplier of competition BJJ / Jiu Jitsu Gis,
              sublimated rash guards, No-Gi fight shorts, and compression spats for academies and
              private-label brands.
            </p>
          </div>

          <div className="md:col-span-3 space-y-2 text-xs">
            <div className="font-mono uppercase tracking-wider text-zinc-300 mb-3">
              Product Lines
            </div>
            {CATEGORY_TABS.filter((c) => c.id !== 'all').map((cat) => (
              <div key={cat.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {cat.label}
                </button>
              </div>
            ))}
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <div className="font-mono uppercase tracking-wider text-zinc-300">
              Bulk &amp; Private Label Desk
            </div>
            <p className="text-zinc-400 leading-relaxed">
              MOQ from 25 pieces per style. Custom OEM quotes and pre-production samples dispatched
              globally via DHL Express.
            </p>
            <button
              type="button"
              onClick={() => setIsQuoteOpen(true)}
              className="inline-flex items-center px-5 py-2.5 bg-white text-[#111215] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Request Custom Quote
            </button>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
            <span>© {new Date().getFullYear()} Zayvor Sports Industries. All rights reserved.</span>
            <span>OEM · Private Label · Worldwide Export</span>
          </div>
        </div>
      </footer>

      {/* Product Specification & Quote Configurator Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={handleAddToQuote}
      />

      {/* Slide-Over Quote & Sample Bag Drawer */}
      <QuoteDrawer
        isOpen={isQuoteOpen}
        items={quoteBag}
        onClose={() => setIsQuoteOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearBag={() => setQuoteBag([])}
      />

      {/* Quick-Add Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 bg-[#111215] text-white px-4 py-3 rounded-sm shadow-lg border border-white/15 flex items-center gap-4 text-xs"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setIsQuoteOpen(true);
            }}
            className="font-bold text-[#E5B84B] hover:underline whitespace-nowrap cursor-pointer tabular-nums"
          >
            View Bag ({totalBagUnits} pcs)
          </button>
        </div>
      )}

      {/* Privacy / Screen-Capture Deterrence Shield */}
      {privacyShield && (
        <div
          aria-live="assertive"
          className="fixed inset-0 z-[100] bg-[#0B0C0F]/98 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center text-white"
        >
          <ShieldAlert className="w-10 h-10 text-[#E5B84B] mb-3" />
          <p className="font-display text-2xl font-bold tracking-wide mb-1">
            Zayvor Protected Catalog
          </p>
          <p className="text-xs text-zinc-400 max-w-sm">
            Images and product designs are protected against copying, downloading, and screen
            capture.
          </p>
        </div>
      )}
    </div>
  );
}
