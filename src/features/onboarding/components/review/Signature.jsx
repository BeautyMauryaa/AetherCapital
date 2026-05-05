import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { useOnboardingStore } from "@/app/store/onboarding.store";
import { useTheme } from "@/context/ThemeContext";
import "./Signature.css";

const Signature = () => {
  const { formData, updateForm } = useOnboardingStore();
  const { isDark } = useTheme();
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
      const { width, height } = canvas;
      if (!width || !height) return;
      const padding = 40;
      const zones = [
        ctx.getImageData(0, 0, width, padding),
        ctx.getImageData(0, height - padding, width, padding),
        ctx.getImageData(0, 0, padding, height),
        ctx.getImageData(width - padding, 0, padding, height),
      ];
      const hasInk = (data) => {
        for (let i = 3; i < data.length; i += 4) if (data[i] > 0) return true;
        return false;
      };
      if (zones.some(zone => hasInk(zone.data))) autoSubmit();
    } catch (err) { console.warn("Edge detection error:", err); }
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
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-main opacity-40">
          E-Signature <span className="text-purple-500">*</span>
        </label>
      </div>

      <div className={`signature-container ${isCaptured ? "signature-captured" : ""}`}>
 
        <div className={`sig-pill ${isCaptured ? "sig-pill-captured" : "sig-pill-waiting"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${!isCaptured ? "animate-pulse bg-purple-500" : "bg-emerald-500"}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {isCaptured ? "Signature captured" : "Awaiting input"}
          </span>
          {isCaptured && <CheckCircle2 size={12} />}
        </div>

        <button type="button" onClick={clear} className="sig-reset-btn">
          <RotateCcw size={14} />
        </button>

        <div className="absolute inset-0 z-10">
          <SigCanvas
            ref={sigCanvas}
            penColor={penColor}
            onBegin={() => setIsDrawing(true)}
            onEnd={() => { setIsDrawing(false); if (!isCaptured) autoSubmit(); }}
            canvasProps={{ className: 'w-full h-full cursor-crosshair', willReadFrequently: true }}
          />
        </div>

        <div className="sig-guide-line" />
        <div className="sig-guide-text">× Sign Here</div>
      </div>

      <p className="mt-2 text-[10px] italic text-main opacity-30">
        Sign with your mouse or touch
      </p>
    </div>
  );
};

export default Signature;