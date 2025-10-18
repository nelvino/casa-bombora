"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ReactPageFlip = dynamic(() => import("react-pageflip").then(m => m.default), { ssr: false });
const PageFlipAny: any = ReactPageFlip as unknown as any;

export function Portfolio() {
  const pdfUrl = "/api/portfolio-pdf"; // served by src/app/api/portfolio-pdf/route.ts

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(900);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFirstImageRef = useRef(false);

  // Resize handling
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) setWidth(Math.min(900, Math.floor(rect.width)));
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Utility to load an external script once
  function loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existing) {
        // If already loaded and global is available, resolve immediately
        // @ts-ignore
        if ((window as any).pdfjsLib && (window as any).pdfjsLib.getDocument) {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        if ((existing as any).readyState === 'complete') {
          resolve();
        }
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(s);
    });
  }

  // Load and render PDF pages to images using pdf.js directly
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setImages([]);
        // Load a stable UMD build of pdf.js from CDN to avoid bundler issues
        const PDFJS_VERSION = '3.11.174';
        // Load pdf.js library
        await loadScript(`https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.js`);
        // @ts-ignore
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib || !pdfjsLib.getDocument) throw new Error('pdfjsLib not available');
        // Disable worker to avoid route 404 / worker CORS issues (small perf hit, but stable)
        pdfjsLib.GlobalWorkerOptions.workerSrc = undefined as any;
        pdfjsLib.disableWorker = true;

        // Fetch PDF as ArrayBuffer to avoid CORS/range request issues
        const resp = await fetch(pdfUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status} loading PDF`);
        const data = await resp.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;

        const rendered: string[] = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) break;
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1 });
          const targetWidth = width; // scale to container width
          const scale = targetWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = Math.floor(scaledViewport.width);
          canvas.height = Math.floor(scaledViewport.height);

          await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
          rendered.push(dataUrl);

          // Progressive update to avoid long blank state
          if (!cancelled) {
            setImages((prev) => {
              const next = prev.length === 0 ? [dataUrl] : [...prev, dataUrl];
              if (!hasFirstImageRef.current && next.length > 0) {
                hasFirstImageRef.current = true;
                setError(null);
              }
              return next;
            });
          }
        }

        if (!cancelled) {
          if (rendered.length > 0) setImages(rendered);
          setLoading(false);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error("Portfolio PDF load error:", e);
        if (!cancelled) {
          setError(`Failed to load PDF${e?.message ? `: ${e.message}` : ''}`);
          setLoading(false);
        }
      }
    }
    load();
    // timeout guard: surface error if nothing rendered after 10s
    const t = window.setTimeout(() => {
      if (!cancelled && !hasFirstImageRef.current && loading) {
        // eslint-disable-next-line no-console
        console.warn('[Portfolio] Timeout waiting for PDF render');
        setError('Taking longer than usual to render…');
      }
    }, 10000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [pdfUrl, width]);

  return (
    <section id="portfolio" className="py-20 bg-alabaster">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-gunmetal mb-6">Portfolio</h2>
        <p className="text-gunmetal/80 max-w-2xl mb-8">Flip through our portfolio like a book.</p>

        <div className="mb-6">
          <a
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gunmetal text-alabaster hover:bg-gunmetal/90"
            href={`${pdfUrl}?download=1`}
          >
            Download PDF
          </a>
        </div>

        <div ref={containerRef} className="w-full">
          <div className="bg-white shadow rounded p-2">
            {error && (
              <div className="text-red-600">{error}</div>
            )}
            {loading && images.length === 0 ? (
              <div className="w-full flex items-center justify-center py-10 text-blue-green">Loading…</div>
            ) : (
              <div className="flex justify-center">
                <PageFlipAny
                  width={width}
                  height={Math.round(width * 1.3)}
                  size="fixed"
                  minWidth={320}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={2000}
                  drawShadow
                  flippingTime={700}
                  usePortrait={true}
                  showCover={false}
                  startPage={0}
                  startZIndex={0}
                  autoSize={true}
                  maxShadowOpacity={0.5}
                  className="shadow-lg"
                  style={{}}
                >
                  {images.map((src, idx) => (
                    <div key={idx} className="bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Portfolio page ${idx + 1}`} className="block w-full h-auto" />
                    </div>
                  ))}
                </PageFlipAny>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
