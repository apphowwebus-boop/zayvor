import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { QuoteBagItem } from '../types/catalog';
import { ProtectedMedia } from './ProtectedMedia';

interface QuoteDrawerProps {
  isOpen: boolean;
  items: QuoteBagItem[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearBag: () => void;
}

export function QuoteDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearBag,
}: QuoteDrawerProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactEmail.trim()) {
      setFormError('Please provide your brand or academy name and a contact email.');
      return;
    }
    setFormError(null);
    const randomRef = `ZV-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(randomRef);
    onClearBag();
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    setCompanyName('');
    setContactEmail('');
    setCountry('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Quote and Sample Inquiry Bag"
      onClick={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className="w-full max-w-lg bg-[#FAF9F7] text-[#111215] h-full flex flex-col shadow-2xl border-l border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#111215]">
              OEM Quote &amp; Sample Bag
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">
              {totalUnits > 0
                ? `${items.length} style${items.length > 1 ? 's' : ''} · ${totalUnits} total units`
                : 'Custom factory quote on request · Low MOQ from 25 pcs'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close quote drawer"
            className="w-10 h-10 inline-flex items-center justify-center rounded-sm hover:bg-black/5 text-zinc-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {submittedRef ? (
            <div className="py-10 px-6 bg-white border border-black/10 rounded-sm text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto mb-3" />
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-1">
                Inquiry Reference #{submittedRef}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#111215] mb-2">
                Quote Request Confirmed
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Thank you, <span className="font-semibold text-[#111215]">{companyName}</span>. Our
                export production desk will prepare your custom quotation, sample timeline, and
                shipping quote for <span className="font-semibold">{contactEmail}</span> within 24
                hours.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-[#111215] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Return to Catalog
              </button>
            </div>
          ) : (
            <>
              {/* Itemized Quote List (No Prices) */}
              {items.length > 0 ? (
                <div className="divide-y divide-black/10 border-b border-black/10 pb-4">
                  {items.map((item) => (
                    <div key={item.key} className="py-4 first:pt-0 flex gap-4">
                      <div className="relative w-16 h-20 bg-[#ECEBE8] shrink-0 overflow-hidden">
                        <ProtectedMedia
                          src={item.product.image}
                          alt={item.product.imageAlt}
                          objectFit="cover"
                          objectPosition="top"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#111215] truncate">
                            {item.product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.key)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-zinc-400 hover:text-red-700 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate">
                          {item.product.sku} · Size {item.size} · {item.customization}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="inline-flex items-center border border-black/15 bg-white rounded-sm">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -5)}
                              aria-label="Decrease item quantity"
                              className="w-7 h-7 inline-flex items-center justify-center hover:bg-black/5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 font-mono text-xs font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 5)}
                              aria-label="Increase item quantity"
                              className="w-7 h-7 inline-flex items-center justify-center hover:bg-black/5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right font-mono tabular-nums text-xs text-zinc-600">
                            {item.quantity} pcs · Custom Quote
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 bg-white border border-black/10 rounded-sm">
                  <p className="text-sm font-medium text-[#111215] mb-1">
                    No catalog styles added yet
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Add Gis, Rash Guards, Shorts, or Spats from the catalog to build your bulk or
                    sample inquiry, or submit a custom OEM manufacturing brief below.
                  </p>
                </div>
              )}

              {/* Direct OEM / Bulk Inquiry Form */}
              <form id="quote-inquiry-form" onSubmit={handleSubmit} className="space-y-3.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Factory Quote Details
                </div>

                {formError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
                    {formError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="quote-company"
                    className="block text-xs font-medium text-zinc-700 mb-1"
                  >
                    Brand / Gym / Academy Name *
                  </label>
                  <input
                    id="quote-company"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Jiu Jitsu Academy"
                    className="w-full h-10 px-3 text-sm bg-white border border-black/15 rounded-sm focus:outline-none focus:border-[#111215]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="quote-email"
                      className="block text-xs font-medium text-zinc-700 mb-1"
                    >
                      Business Email *
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="orders@yourbrand.com"
                      className="w-full h-10 px-3 text-sm bg-white border border-black/15 rounded-sm focus:outline-none focus:border-[#111215]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-country"
                      className="block text-xs font-medium text-zinc-700 mb-1"
                    >
                      Destination Country
                    </label>
                    <input
                      id="quote-country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="USA, UK, UAE, Australia..."
                      className="w-full h-10 px-3 text-sm bg-white border border-black/15 rounded-sm focus:outline-none focus:border-[#111215]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-notes"
                    className="block text-xs font-medium text-zinc-700 mb-1"
                  >
                    Custom Logo, GSM &amp; Private Label Notes
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your custom artwork, weave GSM, woven labels, or sample requirements..."
                    className="w-full p-3 text-sm bg-white border border-black/15 rounded-sm focus:outline-none focus:border-[#111215] resize-none"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        {/* Drawer Footer (No Prices) */}
        {!submittedRef && (
          <div className="p-6 border-t border-black/10 bg-white space-y-3">
            {items.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">Total Selected Quantity</span>
                <span className="font-mono text-base font-bold tabular-nums text-[#111215]">
                  {totalUnits} pcs
                </span>
              </div>
            )}
            <button
              type="submit"
              form="quote-inquiry-form"
              className="w-full h-11 bg-[#C9931E] hover:bg-[#D9A32A] text-[#111215] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Submit Official Quote Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
