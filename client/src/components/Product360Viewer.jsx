import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Move,
  Compass,
  Sparkles,
  Layers,
  Box,
  Image as ImageIcon
} from 'lucide-react';

export default function Product360Viewer({
  product,
  className = '',
  selectedColor: controlledSelectedColor,
  onSelectColor
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesCacheRef = useRef({});
  const autoRotateTimerRef = useRef(null);
  const inertiaAnimRef = useRef(null);

  // Available interactive colors (e.g. for Hot Water Bag or custom color products)
  const colorsList = product?.colors || [];
  const [internalSelectedColor, setInternalSelectedColor] = useState(colorsList[0] || null);
  const activeColor = controlledSelectedColor || internalSelectedColor;

  const handleColorChange = (col) => {
    setInternalSelectedColor(col);
    if (onSelectColor) onSelectColor(col);
  };

  // Determine media mode: 3D Model (.glb) vs Frame Sequence vs Fallback
  const glbUrl = product?.model3d || product?.glbUrl || product?.modelUrl || null;
  const rawFrames = product?.frames360 || [];
  
  // Normalized frame sequence list
  const frames = Array.isArray(rawFrames) && rawFrames.length > 0
    ? rawFrames
    : [
        product?.frontImage || product?.images?.[0] || '/images/products/regular-front.jpg'
      ];

  const totalFrames = frames.length;
  const isSequence = totalFrames > 1 && !glbUrl;

  // Viewer State
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPreloading, setIsPreloading] = useState(isSequence);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(isSequence);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewerMode, setViewerMode] = useState(glbUrl ? '3d-model' : isSequence ? 'sequence' : 'single');

  // Drag tracking refs
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    startFrame: 0,
    startPanX: 0,
    startPanY: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    isPanning: false
  });

  // Preload and cache all frames before interaction
  useEffect(() => {
    if (!isSequence) {
      setIsPreloading(false);
      setLoadProgress(100);
      return;
    }

    let isMounted = true;
    let loadedCount = 0;
    setIsPreloading(true);
    setLoadProgress(0);

    const loadPromises = frames.map((url, idx) => {
      return new Promise((resolve) => {
        if (imagesCacheRef.current[url]) {
          loadedCount++;
          if (isMounted) setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          resolve(imagesCacheRef.current[url]);
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;

        const onDone = () => {
          imagesCacheRef.current[url] = img;
          loadedCount++;
          if (isMounted) {
            setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          }
          resolve(img);
        };

        if ('decode' in img) {
          img.decode().then(onDone).catch(onDone);
        } else {
          img.onload = onDone;
          img.onerror = onDone;
        }
      });
    });

    Promise.all(loadPromises).then(() => {
      if (isMounted) {
        setIsPreloading(false);
        setLoadProgress(100);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [frames, isSequence, totalFrames]);

  // Render current frame on High-DPI transparent <canvas> with object-fit: contain
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    // Set internal resolution matching devicePixelRatio
    if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
    }

    // Reset transform & clear canvas to 100% transparent
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const currentUrl = frames[currentFrame % totalFrames];
    const img = imagesCacheRef.current[currentUrl];

    if (!img || !img.complete || img.naturalWidth === 0) {
      // Fallback: draw frontImage if current frame not yet available
      const fallbackUrl = product?.frontImage || product?.images?.[0];
      const fallbackImg = imagesCacheRef.current[fallbackUrl];
      if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
        drawImageContained(ctx, fallbackImg, rect.width, rect.height, zoom, pan);
      }
      return;
    }

    drawImageContained(ctx, img, rect.width, rect.height, zoom, pan);
  }, [currentFrame, frames, totalFrames, zoom, pan, product, activeColor]);

  // Helper: Draw image with object-fit contain, zero stretching/cropping, scaled only on product layer
  const drawImageContained = (ctx, img, containerW, containerH, scale, panOffset) => {
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgRatio = imgW / imgH;
    const containerRatio = containerW / containerH;

    let baseW, baseH;
    if (imgRatio > containerRatio) {
      baseW = containerW * 0.85;
      baseH = baseW / imgRatio;
    } else {
      baseH = containerH * 0.85;
      baseW = baseH * imgRatio;
    }

    const finalW = baseW * scale;
    const finalH = baseH * scale;

    const posX = (containerW - finalW) / 2 + panOffset.x;
    const posY = (containerH - finalH) / 2 + panOffset.y;

    if (activeColor?.colorFilter && activeColor.colorFilter !== 'none') {
      ctx.filter = activeColor.colorFilter;
    } else {
      ctx.filter = 'none';
    }

    ctx.drawImage(img, posX, posY, finalW, finalH);
    ctx.filter = 'none';
  };

  // Re-draw whenever currentFrame, zoom, or pan changes
  useEffect(() => {
    if (viewerMode === '3d-model') return;
    renderCanvas();
  }, [renderCanvas, viewerMode]);

  // Window resize observer to maintain sharp canvas rendering
  useEffect(() => {
    if (viewerMode === '3d-model') return;
    const handleResize = () => {
      renderCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas, viewerMode]);

  // Auto-rotate slowly on load, stops on first interaction
  useEffect(() => {
    if (!isAutoRotate || isPreloading || !isSequence || isDragging) {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
      return;
    }

    // Step 1 frame every 110ms (~9 frames/sec, smooth loop)
    autoRotateTimerRef.current = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 110);

    return () => {
      if (autoRotateTimerRef.current) clearInterval(autoRotateTimerRef.current);
    };
  }, [isAutoRotate, isPreloading, isSequence, isDragging, totalFrames]);

  // Stop auto rotate on first user action
  const stopAutoOnInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setIsAutoRotate(false);
    }
  };

  // Inertia decay loop after drag release
  const startInertia = (initialVelocity) => {
    if (Math.abs(initialVelocity) < 0.15) return;

    let currentVel = initialVelocity;
    const step = () => {
      currentVel *= 0.90; // friction decay
      if (Math.abs(currentVel) > 0.08) {
        const deltaFrames = Math.round(currentVel * 1.5);
        if (deltaFrames !== 0) {
          setCurrentFrame((prev) => (prev - deltaFrames + totalFrames * 100) % totalFrames);
        }
        inertiaAnimRef.current = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(inertiaAnimRef.current);
      }
    };
    inertiaAnimRef.current = requestAnimationFrame(step);
  };

  // ==========================================
  // MOUSE & TOUCH EVENT HANDLERS
  // ==========================================
  const handlePointerDown = (clientX, clientY, isSecondary = false) => {
    stopAutoOnInteraction();
    if (inertiaAnimRef.current) cancelAnimationFrame(inertiaAnimRef.current);

    setIsDragging(true);
    const isPanning = isSecondary || (zoom > 1.05);

    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startFrame: currentFrame,
      startPanX: pan.x,
      startPanY: pan.y,
      lastX: clientX,
      lastTime: performance.now(),
      velocity: 0,
      isPanning
    };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);
    const dx = clientX - dragRef.current.lastX;
    dragRef.current.velocity = dx / dt;
    dragRef.current.lastX = clientX;
    dragRef.current.lastTime = now;

    if (dragRef.current.isPanning && zoom > 1) {
      // Pan when zoomed
      const panDx = clientX - dragRef.current.startX;
      const panDy = clientY - dragRef.current.startY;
      const maxPanX = (zoom - 1) * 200;
      const maxPanY = (zoom - 1) * 150;

      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, dragRef.current.startPanX + panDx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, dragRef.current.startPanY + panDy))
      });
    } else if (isSequence) {
      // 12px drag per frame step
      const totalDx = clientX - dragRef.current.startX;
      const pixelsPerFrame = 12;
      const frameDelta = Math.floor(totalDx / pixelsPerFrame);
      const newFrame = (dragRef.current.startFrame - frameDelta + totalFrames * 100) % totalFrames;
      setCurrentFrame(newFrame);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (!dragRef.current.isPanning && isSequence) {
      startInertia(dragRef.current.velocity);
    }
  };

  // Mouse Handlers
  const onMouseDown = (e) => {
    if (e.button === 2) e.preventDefault(); // allow right click for pan
    handlePointerDown(e.clientX, e.clientY, e.button === 2);
  };

  const onMouseMove = (e) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => {
    handlePointerUp();
  };

  // Touch Handlers
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY, false);
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const onTouchEnd = () => {
    handlePointerUp();
  };

  // Mouse Wheel Zoom (Scales ONLY product layer, background remains 100% static)
  const onWheel = (e) => {
    e.preventDefault();
    stopAutoOnInteraction();
    const zoomFactor = e.deltaY < 0 ? 0.15 : -0.15;
    setZoom((prev) => {
      const nextZoom = Math.max(1, Math.min(3, prev + zoomFactor));
      if (nextZoom === 1) setPan({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  // Keyboard Navigation (Arrow keys step frames)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        stopAutoOnInteraction();
        setCurrentFrame((prev) => (prev - 1 + totalFrames) % totalFrames);
      } else if (e.key === 'ArrowRight') {
        stopAutoOnInteraction();
        setCurrentFrame((prev) => (prev + 1) % totalFrames);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalFrames]);

  // Reset viewer to initial state
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setCurrentFrame(0);
    setIsAutoRotate(isSequence);
    setHasInteracted(false);
  };

  // Approximate angle in degrees
  const angleDeg = isSequence ? Math.round((currentFrame / totalFrames) * 360) : 0;

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 select-none ${className}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 
        ============================================================
        LAYER 1: STATIC STUDIO BACKGROUND (NEVER MOVES, NEVER TRANSFORMS)
        - Charcoal/black gradient with soft spotlight glow
        - Studio vignette and subtle noise/grain
        - Contact elliptical ground shadow under product
        - Subtle rim-light glow behind product
        ============================================================
      */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 48%, #1f1b2b 0%, #13111c 45%, #0a0910 75%, #040306 100%)'
        }}
      >
        {/* Soft Spotlight Glow Behind Product */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 46%, rgba(217, 70, 239, 0.14) 0%, rgba(99, 102, 241, 0.08) 35%, transparent 68%)'
          }}
        />

        {/* Faint Studio Vignette (Deepening Outer Corners) */}
        <div
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 130px rgba(0, 0, 0, 0.88)'
          }}
        />

        {/* Subtle Rim-Light Ambient Aura */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, transparent 65%)',
            filter: 'blur(30px)'
          }}
        />

        {/* Static Elliptical Contact Shadow Under Product */}
        <div
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: `${Math.min(360, 290 * zoom)}px`,
            height: `${Math.min(65, 52 * zoom)}px`,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.45) 50%, transparent 75%)',
            filter: 'blur(9px)',
            opacity: 0.85
          }}
        />
      </div>

      {/* 
        ============================================================
        LAYER 2: INTERACTIVE PRODUCT LAYER
        - NEVER applies CSS rotate/transform to container or background
        - Mode B: <model-viewer> if .glb exists
        - Mode A: Transparent <canvas> with 360 sequence frames
        - Progress bar while preloading
        ============================================================
      */}
      <div
        className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        {/* MODE B: 3D MODEL (.glb) via Google <model-viewer> */}
        {viewerMode === '3d-model' && glbUrl && (
          <div className="w-full h-full flex items-center justify-center">
            <model-viewer
              src={glbUrl}
              alt={product?.name || '3D Product Model'}
              camera-controls
              auto-rotate
              shadow-intensity="1.5"
              environment-image="neutral"
              touch-action="pan-y"
              poster={product?.frontImage || product?.images?.[0]}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent'
              }}
            ></model-viewer>
          </div>
        )}

        {/* MODE A: 360 FRAME SEQUENCE ON TRANSPARENT CANVAS */}
        {viewerMode !== '3d-model' && (
          <canvas
            ref={canvasRef}
            className="w-full h-full block pointer-events-none"
            style={{
              backgroundColor: 'transparent'
            }}
          />
        )}

        {/* PRELOADING PROGRESS BAR OVERLAY */}
        {isPreloading && (
          <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center space-y-3 p-6 text-center">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-white tracking-wider uppercase">
                Loading 360° Studio Sequence...
              </p>
              <p className="text-[11px] font-mono text-amber-300 font-bold">
                {loadProgress}% loaded
              </p>
            </div>
            {/* Progress Bar Track */}
            <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-150"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* DRAG TO ROTATE HINT PILL */}
        {!hasInteracted && !isPreloading && isSequence && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-black/65 backdrop-blur-md border border-white/20 text-gray-100 text-xs font-bold px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            <span>Drag to rotate</span>
            <span className="text-[10px] text-amber-300 font-mono">360°</span>
          </div>
        )}

        {/* MINIMAL INTERACTIVE COLOR SELECTION SWATCHES BAR (Directly underneath floating product) */}
        {colorsList.length > 0 && (
          <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-25 pointer-events-auto bg-black/65 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider hidden sm:inline mr-0.5">
              Color:
            </span>
            {colorsList.map((col, idx) => {
              const isSelected = activeColor?.name === col.name;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(col);
                  }}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-200 relative flex items-center justify-center ${
                    isSelected
                      ? 'border-white scale-125 ring-2 ring-amber-400 ring-offset-1 ring-offset-black/80 shadow-md'
                      : 'border-white/40 hover:border-white hover:scale-110 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-900 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TOP HUD: Live Degree Angle & Sequence Info */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white shadow-lg pointer-events-auto">
            <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span className="text-xs font-bold tracking-wide">
              {viewerMode === '3d-model' ? '3D WebGL Model' : '360° Product View'}
            </span>
            {isSequence && (
              <span className="text-[11px] text-amber-300 font-mono font-bold">
                ({angleDeg}°)
              </span>
            )}
          </div>

          {isSequence && (
            <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-gray-300 text-[11px] font-mono pointer-events-auto">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Frame {currentFrame + 1}/{totalFrames}</span>
            </div>
          )}
        </div>

        {/* BOTTOM HUD CONTROLS TOOLBAR */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-auto">
          {/* Play/Pause Auto-Rotate & Reset */}
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl">
            {isSequence && (
              <button
                onClick={() => {
                  setHasInteracted(true);
                  setIsAutoRotate(!isAutoRotate);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  isAutoRotate
                    ? 'bg-amber-400 text-gray-950 font-black shadow-md'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={isAutoRotate ? 'Pause 360 Rotation' : 'Auto 360 Rotation'}
              >
                {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">
                  {isAutoRotate ? 'Pause 360' : 'Auto 360'}
                </span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition text-xs"
              title="Reset 360 Position & Zoom"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom In, Zoom Out & Percentage */}
          <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl text-white">
            <button
              onClick={() => {
                stopAutoOnInteraction();
                setZoom((z) => {
                  const nz = Math.max(1, z - 0.25);
                  if (nz === 1) setPan({ x: 0, y: 0 });
                  return nz;
                });
              }}
              disabled={zoom <= 1}
              className="p-2 rounded-xl hover:bg-white/10 transition disabled:opacity-30"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono px-2 font-bold text-amber-300 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => {
                stopAutoOnInteraction();
                setZoom((z) => Math.min(3, z + 0.25));
              }}
              disabled={zoom >= 3}
              className="p-2 rounded-xl hover:bg-white/10 transition disabled:opacity-30"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
