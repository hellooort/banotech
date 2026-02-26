'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PdfFlipbookProps {
  url: string;
  onClose: () => void;
}

interface PageProps {
  src: string;
  pageNum: number;
}

const Page = ({ src, pageNum }: PageProps) => (
  <div className="relative w-full h-full bg-white flex items-center justify-center">
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={`Page ${pageNum}`} className="w-full h-full object-contain" />
    ) : (
      <div className="text-muted text-sm">Loading...</div>
    )}
  </div>
);

export default function PdfFlipbook({ url, onClose }: PdfFlipbookProps) {
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipBookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; turnToPage: (n: number) => void } }>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        setTotalPages(pdf.numPages);
        const pageImages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, canvas, viewport }).promise;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.92));
          if (cancelled) return;
        }

        setPages(pageImages);
        setLoading(false);
      } catch (err) {
        console.error('PDF load error:', err);
        setLoading(false);
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [url]);

  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const goPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => flipBookRef.current?.pageFlip()?.flipNext();

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const bookWidth = Math.min(500, typeof window !== 'undefined' ? window.innerWidth * 0.4 : 500);
  const bookHeight = bookWidth * 1.414;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" ref={containerRef}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/60 to-transparent z-10">
        <div className="text-white/70 text-sm">
          {loading ? 'PDF 로딩중...' : `${currentPage + 1} / ${totalPages}`}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(0.6, s - 0.15))} className="p-2 text-white/60 hover:text-white transition-colors" title="축소">
            <ZoomOut size={18} />
          </button>
          <span className="text-white/50 text-xs min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(1.5, s + 0.15))} className="p-2 text-white/60 hover:text-white transition-colors" title="확대">
            <ZoomIn size={18} />
          </button>
          <button onClick={toggleFullscreen} className="p-2 text-white/60 hover:text-white transition-colors" title="전체화면">
            <Maximize2 size={18} />
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/60 hover:text-white transition-colors" title="다운로드">
            <Download size={18} />
          </a>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white transition-colors" title="닫기">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Flipbook */}
      {!loading && pages.length > 0 && (
        <div className="flex items-center gap-4" style={{ transform: `scale(${scale})`, transition: 'transform 0.2s' }}>
          <button
            onClick={goPrev}
            className="p-3 text-white/40 hover:text-white transition-colors"
            disabled={currentPage === 0}
          >
            <ChevronLeft size={32} />
          </button>

          {/* @ts-expect-error react-pageflip types */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={bookWidth}
            height={bookHeight}
            size="stretch"
            minWidth={300}
            maxWidth={600}
            minHeight={400}
            maxHeight={900}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            className="shadow-2xl"
            flippingTime={600}
            usePortrait={false}
            startZIndex={0}
            autoSize={true}
            maxShadowOpacity={0.3}
            drawShadow={true}
            useMouseEvents={true}
            swipeDistance={30}
            clickEventForward={false}
            startPage={0}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {pages.map((src, i) => (
              <div key={i} className="bg-white">
                <Page src={src} pageNum={i + 1} />
              </div>
            ))}
          </HTMLFlipBook>

          <button
            onClick={goNext}
            className="p-3 text-white/40 hover:text-white transition-colors"
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
          <p className="text-white/60 text-sm">PDF 페이지를 준비하고 있습니다...</p>
        </div>
      )}
    </div>
  );
}
