import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, CheckCircle } from 'lucide-react';
import "./SignatureBox.css";

const SignatureBox = () => {
  const sigCanvas = useRef(null);
  const [imageURL, setImageURL] = useState(null);

  const clear = () => {
    sigCanvas.current.clear();
    setImageURL(null);
  };

  const save = () => {
    if (sigCanvas.current.isEmpty()) return;
    
    const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setImageURL(dataURL);
  };

  return (
    <div className="sig-box-container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-main opacity-50">
          Authorization Signature
        </h3>
        {imageURL && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase">
            <CheckCircle size={12} /> Validated
          </span>
        )}
      </div>

      <div className="canvas-wrapper">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="var(--text-main)"
          canvasProps={{
            className: 'w-full h-full cursor-crosshair'
          }}
        />
        {/* Decorative elements */}
        <div className="sig-line" />
        <div className="sig-hint">Sign above this line</div>
      </div>
      
      <div className="sig-button-group">
        <button onClick={clear} className="sig-btn sig-btn-secondary flex items-center gap-2">
          <Trash2 size={14} /> Clear
        </button>
        <button onClick={save} className="sig-btn sig-btn-primary">
          Confirm Signature
        </button>
      </div>

      {imageURL && (
        <div className="sig-preview-area animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-[9px] font-mono uppercase tracking-widest text-main opacity-30 mb-4">
            Encrypted Preview Output:
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-dashed border-border flex justify-center">
            <img 
              src={imageURL} 
              alt="Your Signature" 
              className="max-h-24 invert-0 dark:invert" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureBox;