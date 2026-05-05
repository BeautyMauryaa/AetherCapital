import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";

const Signature = () => {
  const { formData, updateForm } = useOnboardingStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sigCanvas = useRef(null);
  const SigCanvas = SignatureCanvas?.default || SignatureCanvas;

  const [isCaptured, setIsCaptured] = useState(!!formData.signatureData);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (formData.signatureData && sigCanvas.current) {
      sigCanvas.current.fromDataURL(formData.signatureData);
    }
  }, []);

  const autoSubmit = () => {
    if (!sigCanvas.current || isCaptured) return;
    const trimmed = sigCanvas.current.getTrimmedCanvas();
    if (trimmed.width < 50 || trimmed.height < 20) return;
    const dataURL = trimmed.toDataURL('image/png');
    updateForm({ signatureData: dataURL });
    setIsCaptured(true);
  };

  const checkIfTouchingEdge = () => {
    try {
      if (!sigCanvas.current || isCaptured) return;
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;
      if (!width || !height) return;
      const padding = 40;
      const zones = [
        ctx.getImageData(0, 0, width, padding),
        ctx.getImageData(0, height - padding, width, padding),
        ctx.getImageData(0, 0, padding, height),
        ctx.getImageData(width - padding, 0, padding, height),
      ];
      const hasInk = (data) => {
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0) return true;
        }
        return false;
      };
      if (zones.some(zone => hasInk(zone.data))) autoSubmit();
    } catch (err) {
      console.warn("Edge detection error:", err);
    }
  };

  useEffect(() => {
    if (!isDrawing && isCaptured) return;
    let frame;
    const detect = () => {
      if (!isCaptured) {
        checkIfTouchingEdge();
        frame = requestAnimationFrame(detect);
      }
    };
    detect();
    return () => cancelAnimationFrame(frame);
  }, [isDrawing, isCaptured]);

  const clear = () => {
    sigCanvas.current.clear();
    setIsCaptured(false);
    updateForm({ signatureData: null });
  };

  const penColor = isCaptured ? "#10b981" : (isDark ? "#ffffff" : "#1f2937");

  return (
    <div className="mt-8">
      {/* Label */}
      <div className="flex justify-between items-center mb-4">
        <label className={`text-[10px] font-bold tracking-[0.2em] uppercase
          ${isDark ? "text-white/40" : "text-slate-400"}`}>
          E-Signature <span className="text-purple-500">*</span>
        </label>
      </div>

      {/* Canvas Box */}
      <div className={`relative h-48 rounded-2xl transition-all duration-500 overflow-hidden border
        ${isCaptured
          ? "border-emerald-500/40 bg-emerald-500/[0.03]"
          : isDark ? "border-white/10 bg-[#16161D]" : "border-slate-200 bg-white"
        }`}>

        {/* Status Pill */}
        <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border
          ${isCaptured
            ? "bg-emerald-500/12 border-emerald-500/30 text-emerald-500"
            : isDark ? "bg-[#0B0B0E] border-white/10 text-white/40" : "bg-slate-100 border-slate-200 text-slate-400"
          }`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!isCaptured ? "animate-pulse" : ""}
            ${isCaptured ? "bg-emerald-500" : isDark ? "bg-white/30" : "bg-slate-400"}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isCaptured ? "Signature captured" : "Awaiting input"}
          </span>
          {isCaptured && <CheckCircle2 size={12} />}
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={clear}
          className={`absolute top-4 right-4 z-20 p-2 rounded-xl transition-all hover:opacity-80 border
            ${isDark ? "bg-[#0B0B0E] border-white/10 text-white/50" : "bg-slate-100 border-slate-200 text-slate-500"}`}
        >
          <RotateCcw size={14} />
        </button>

        {/* Canvas */}
        <div className="absolute inset-0 z-10">
          <SigCanvas
            ref={sigCanvas}
            penColor={penColor}
            onBegin={() => setIsDrawing(true)}
            onEnd={() => { setIsDrawing(false); if (!isCaptured) autoSubmit(); }}
            canvasProps={{ className: 'w-full h-full cursor-crosshair', willReadFrequently: true }}
          />
        </div>

        {/* Guide Line */}
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