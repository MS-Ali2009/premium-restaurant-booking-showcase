import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThreeSixtyViewer({ image, onClose }) {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Reset on new image
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  }, [image]);

  // Keyboard close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const onMouseDown = (e) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  const onMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const newX = e.clientX - startDrag.x;
    const newY = e.clientY - startDrag.y;
    setPosition({ x: newX, y: newY });
    lastPosRef.current = { x: newX, y: newY };
  }, [isDragging, startDrag]);

  const onMouseUp = () => setIsDragging(false);

  // Touch events
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setStartDrag({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const onTouchMove = useCallback((e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - startDrag.x;
    const newY = touch.clientY - startDrag.y;
    setPosition({ x: newX, y: newY });
  }, [isDragging, startDrag]);

  const onTouchEnd = () => setIsDragging(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.3, 3.5));
  const handleZoomOut = () => setZoom((z) => {
    const newZ = Math.max(z - 0.3, 0.5);
    if (newZ <= 1) setPosition({ x: 0, y: 0 });
    return newZ;
  });
  const handleReset = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  if (!image) return null;

  const highResSrc = image.src.replace('w=600&h=400', 'w=1600&h=1000');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal/98 backdrop-blur-xl flex flex-col"
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h3 className="text-white font-serif text-lg font-bold">{image.alt}</h3>
            <p className="text-gold/70 text-xs">{image.category} • Drag to explore, scroll to zoom</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Zoom out */}
            <button onClick={handleZoomOut} className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:border-gold/50 hover:text-gold flex items-center justify-center transition-all text-lg font-bold">
              −
            </button>
            {/* Zoom level */}
            <span className="text-white/60 text-xs min-w-[44px] text-center font-mono">{Math.round(zoom * 100)}%</span>
            {/* Zoom in */}
            <button onClick={handleZoomIn} className="w-9 h-9 rounded-full border border-white/20 text-white/80 hover:bg-white/10 hover:border-gold/50 hover:text-gold flex items-center justify-center transition-all text-lg font-bold">
              +
            </button>
            {/* Reset */}
            <button onClick={handleReset} className="px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 hover:text-gold transition-all text-xs">
              Reset
            </button>
            {/* Close */}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center transition-all ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Image viewport */}
        <div
          ref={containerRef}
          className={`flex-1 overflow-hidden flex items-center justify-center relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onWheel={(e) => {
            e.preventDefault();
            if (e.deltaY < 0) handleZoomIn();
            else handleZoomOut();
          }}
        >
          {/* Crosshair hint */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-20">
            <div className="w-px h-20 bg-gold" />
            <div className="absolute w-20 h-px bg-gold" />
          </div>

          <motion.img
            src={highResSrc}
            alt={image.alt}
            draggable={false}
            className="select-none max-w-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              maxWidth: 'none',
              width: `${90 * zoom}vw`,
              height: 'auto',
              maxHeight: 'none',
            }}
          />
        </div>

        {/* Footer navigation hint */}
        <div className="py-3 text-center border-t border-white/10">
          <p className="text-white/30 text-xs">
            🖱️ Drag to pan &nbsp;•&nbsp; Scroll wheel or +/– to zoom &nbsp;•&nbsp; Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-xs font-mono">Esc</kbd> to close
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
