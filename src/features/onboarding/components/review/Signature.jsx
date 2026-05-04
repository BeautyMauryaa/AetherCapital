import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";

const Signature = () => {
  const { formData, updateForm } = useOnboardingStore();
  const sigCanvas = useRef(null);
 const SigCanvas = SignatureCanvas?.default || SignatureCanvas;

  const [isCaptured, setIsCaptured] = useState(!!formData.signatureData);
  const [isDrawing, setIsDrawing] = useState(false);

  // Load saved signature
  useEffect(() => {
    if (formData.signatureData && sigCanvas.current) {
      sigCanvas.current.fromDataURL(formData.signatureData);
    }
  }, []);

  // ✅ MAIN SUBMIT
  const autoSubmit = () => {
    if (!sigCanvas.current || isCaptured) return;

    const trimmed = sigCanvas.current.getTrimmedCanvas();

    // prevent accidental dots
    if (trimmed.width < 50 || trimmed.height < 20) return;

    const dataURL = trimmed.toDataURL('image/png');
    updateForm({ signatureData: dataURL });

    setIsCaptured(true);
  };

  // 🔥 EDGE DETECTION (FAST + REAL)
  const checkIfTouchingEdge = () => {
  try {
    if (!sigCanvas.current || isCaptured) return;

    const canvas = sigCanvas.current.getCanvas();
    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    if (!width || !height) return;

    // 🔥 define INNER boundary (important)
    const padding = 40; // adjust based on UI

    const zones = [
      ctx.getImageData(0, 0, width, padding), // top zone
      ctx.getImageData(0, height - padding, width, padding), // bottom
      ctx.getImageData(0, 0, padding, height), // left
      ctx.getImageData(width - padding, 0, padding, height), // right
    ];

    const hasInk = (data) => {
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) return true;
      }
      return false;
    };

    if (zones.some(zone => hasInk(zone.data))) {
      autoSubmit();
    }

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

  return (
    <div className="mt-8">
      {/* Label */}
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
          E-Signature <span className="text-purple-500">*</span>
        </label>
      </div>

      {/* Box */}
      <div
        className={`relative h-48 rounded-2xl border transition-all duration-500 overflow-hidden 
        ${isCaptured
          ? "border-[#10b981]/40 bg-[#10b981]/[0.02]"
          : "border-white/10 bg-[#0B0B0F]"
        }`}
      >
        {/* Status */}
        <div className={`absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all
          ${isCaptured
            ? "bg-[#10b981]/15 border-[#10b981]/30 text-[#10b981]"
            : "bg-white/[0.03] border-white/10 text-white/30"
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isCaptured ? "bg-[#10b981]" : "bg-white/20 animate-pulse"}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isCaptured ? "Signature captured" : "Awaiting input"}
          </span>
          {isCaptured && <CheckCircle2 size={12} />}
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={clear}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/40 border border-white/5 text-white/20 hover:text-white transition-all"
        >
          <RotateCcw size={14} />
        </button>

        {/* Canvas */}
        <div className="absolute inset-0 z-10">
         <SigCanvas
  ref={sigCanvas}
  penColor={isCaptured ? "#10b981" : "#ffffff"}
  onBegin={() => setIsDrawing(true)}
  onEnd={() => {
    setIsDrawing(false);
    if (!isCaptured) autoSubmit();
  }}
  canvasProps={{
    className: 'w-full h-full cursor-crosshair',
    willReadFrequently: true
  }}
/>
        </div>

        {/* Guide */}
        <div className="absolute bottom-12 left-10 right-10 h-[1px] bg-white/[0.05]" />
        <div className="absolute bottom-4 w-full text-center opacity-20 text-[9px] tracking-[0.4em] uppercase">
          × Sign Here
        </div>
      </div>

      <p className="mt-2 text-[10px] text-white/20 italic">
        Sign with your mouse or touch
      </p>
    </div>
  );
};

export default Signature;