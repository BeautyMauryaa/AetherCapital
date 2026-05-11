import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";

const SIG_KEY = "aether_signature";

const Signature = () => {
  const { formData, updateForm } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark    = theme === "dark";
  const sigCanvas = useRef(null);
  const SigCanvas = SignatureCanvas?.default || SignatureCanvas;

  // ── Restore from sessionStorage on mount ─────────────────────────────────
  const [isCaptured, setIsCaptured] = useState(false);
  const [isDrawing,  setIsDrawing]  = useState(false);

  useEffect(() => {
    // Try sessionStorage first (avoids localStorage quota issue)
    const stored = sessionStorage.getItem(SIG_KEY) || formData.signatureData;
    if (stored && sigCanvas.current) {
      sigCanvas.current.fromDataURL(stored);
      setIsCaptured(true);
      // Sync back to store in memory (not persisted to localStorage)
      if (!formData.signatureData) {
        updateForm({ signatureData: stored });
      }
    }
  }, []);

  // ── Capture signature with white background ───────────────────────────────
  const autoSubmit = () => {
    if (!sigCanvas.current || isCaptured) return;
    const trimmed = sigCanvas.current.getTrimmedCanvas();
    if (trimmed.width < 50 || trimmed.height < 20) return;

    // Flatten to white background with dark ink
    const flat = document.createElement("canvas");
    flat.width  = trimmed.width;
    flat.height = trimmed.height;
    const ctx   = flat.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, flat.width, flat.height);
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(trimmed, 0, 0);

    // Force non-white pixels to near-black
    const imageData = ctx.getImageData(0, 0, flat.width, flat.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
      if (a > 30 && !(r > 240 && g > 240 && b > 240)) {
        d[i] = 30; d[i+1] = 30; d[i+2] = 30; d[i+3] = 255;
      } else {
        d[i] = 255; d[i+1] = 255; d[i+2] = 255; d[i+3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);

    const dataURL = flat.toDataURL("image/png");

    // Save to sessionStorage — avoids localStorage quota exceeded error
    try {
      sessionStorage.setItem(SIG_KEY, dataURL);
    } catch (e) {
      console.warn("sessionStorage full:", e);
    }

    updateForm({ signatureData: dataURL });
    setIsCaptured(true);
  };

  const checkIfTouchingEdge = () => {
    try {
      if (!sigCanvas.current || isCaptured) return;
      const canvas = sigCanvas.current.getCanvas();
      const ctx    = canvas.getContext("2d", { willReadFrequently: true });
      const { width, height } = canvas;
      if (!width || !height) return;
      const p = 40;
      const zones = [
        ctx.getImageData(0, 0, width, p),
        ctx.getImageData(0, height - p, width, p),
        ctx.getImageData(0, 0, p, height),
        ctx.getImageData(width - p, 0, p, height),
      ];
      const hasInk = (d) => { for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true; return false; };
      if (zones.some(z => hasInk(z.data))) autoSubmit();
    } catch (err) {
      console.warn("Edge detection error:", err);
    }
  };

  useEffect(() => {
    if (!isDrawing && isCaptured) return;
    let frame;
    const detect = () => {
      if (!isCaptured) { checkIfTouchingEdge(); frame = requestAnimationFrame(detect); }
    };
    detect();
    return () => cancelAnimationFrame(frame);
  }, [isDrawing, isCaptured]);

  const clear = () => {
    sigCanvas.current?.clear();
    setIsCaptured(false);
    sessionStorage.removeItem(SIG_KEY);
    updateForm({ signatureData: null });
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <label className={`text-[10px] font-bold tracking-[0.2em] uppercase
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          E-Signature <span className="text-purple-500">*</span>
        </label>
      </div>

      <div className={`relative h-48 rounded-2xl transition-all duration-500 overflow-hidden border
        ${isCaptured
          ? "border-emerald-500/40 bg-emerald-500/[0.03]"
          : isDark ? "border-white/10 bg-[#16161D]" : "border-slate-200 bg-white"
        }`}>

        {/* Status Pill */}
        <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border
          ${isCaptured
            ? "bg-emerald-500/12 border-emerald-500/30 text-emerald-500"
            : isDark ? "bg-[#0B0B0E] border-white/10 text-white/40"
                     : "bg-slate-100 border-slate-200 text-slate-400"
          }`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!isCaptured ? "animate-pulse" : ""}
            ${isCaptured ? "bg-emerald-500" : isDark ? "bg-white/30" : "bg-slate-400"}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isCaptured ? "Signature captured" : "Awaiting input"}
          </span>
          {isCaptured && <CheckCircle2 size={12} />}
        </div>

        {/* Reset Button */}
        <button type="button" onClick={clear}
          className={`absolute top-4 right-4 z-20 p-2 rounded-xl transition-all hover:opacity-80 border
            ${isDark ? "bg-[#0B0B0E] border-white/10 text-white/50"
                     : "bg-slate-100 border-slate-200 text-slate-500"}`}>
          <RotateCcw size={14} />
        </button>

        {/* Canvas */}
        <div className="absolute inset-0 z-10">
          <SigCanvas
            ref={sigCanvas}
            penColor="#1f2937"
            onBegin={() => setIsDrawing(true)}
            onEnd={() => { setIsDrawing(false); if (!isCaptured) autoSubmit(); }}
            canvasProps={{ className: 'w-full h-full cursor-crosshair' }}
          />
        </div>

        <div className={`absolute bottom-12 left-10 right-10 h-[1px]
          ${isDark ? "bg-white/10" : "bg-slate-200"}`} />
        <div className={`absolute bottom-4 w-full text-center text-[9px] tracking-[0.4em] uppercase
          ${isDark ? "text-white/20" : "text-slate-300"}`}>
          × Sign Here
        </div>
      </div>

      <p className={`mt-2 text-[10px] italic ${isDark ? "text-white/30" : "text-slate-400"}`}>
        Sign with your mouse or touch
      </p>
    </div>
  );
};

export default Signature;
