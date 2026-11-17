import { useEffect, useRef, useState } from 'react';

interface ProtectedMediaProps {
  src: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
  objectPosition?: 'top' | 'center';
  fallbackTitle?: string;
}

export function ProtectedMedia({
  src,
  alt,
  className = '',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackTitle,
}: ProtectedMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const draw = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!container || !canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, targetW, targetH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = targetW / targetH;

    let drawW = targetW;
    let drawH = targetH;
    let offsetX = 0;
    let offsetY = 0;

    if (objectFit === 'contain') {
      if (imgRatio > boxRatio) {
        drawW = targetW;
        drawH = targetW / imgRatio;
        offsetY = (targetH - drawH) / 2;
      } else {
        drawH = targetH;
        drawW = targetH * imgRatio;
        offsetX = (targetW - drawW) / 2;
      }
    } else {
      // cover
      if (imgRatio > boxRatio) {
        drawH = targetH;
        drawW = targetH * imgRatio;
        offsetX = (targetW - drawW) / 2;
      } else {
        drawW = targetW;
        drawH = targetW / imgRatio;
        offsetY = objectPosition === 'top' ? 0 : (targetH - drawH) / 2;
      }
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  };

  useEffect(() => {
    let active = true;
    setFailed(false);
    setLoaded(false);

    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      if (!active) return;
      imageRef.current = img;
      setLoaded(true);
      draw();
    };
    img.onerror = () => {
      if (!active) return;
      setFailed(true);
    };
    img.src = src;

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, objectFit, objectPosition]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container) return;

    if (canvas) {
      // Harden canvas export APIs against extraction
      try {
        Object.defineProperty(canvas, 'toDataURL', {
          value: () => '',
          configurable: true,
        });
        Object.defineProperty(canvas, 'toBlob', {
          value: () => {},
          configurable: true,
        });
      } catch {
        // Ignore if environment forbids redefining
      }
    }

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(container);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`relative overflow-hidden select-none ${className}`}
    >
      {!failed ? (
        <canvas
          ref={canvasRef}
          className="block w-full h-full pointer-events-none select-none"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#18191D] to-[#26282E]">
          <span className="font-display text-2xl font-bold tracking-wider text-white">
            ZAYVOR
          </span>
          {fallbackTitle && (
            <span className="text-xs text-zinc-300 mt-1">{fallbackTitle}</span>
          )}
        </div>
      )}
      {/* Transparent anti-inspection / anti-copy surface shield */}
      <div
        className="absolute inset-0 z-10 select-none"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        aria-hidden="true"
      />
    </div>
  );
}
