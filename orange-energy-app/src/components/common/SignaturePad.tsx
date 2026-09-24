import React, { useRef, useEffect } from 'react';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  onSave: (blob: Blob) => void;
  onClear: () => void;
  initialUrl?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ label, onSave, onClear, initialUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = initialUrl;
    }
  }, [initialUrl]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx?.beginPath();
    ctx?.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx?.lineTo(clientX - rect.left, clientY - rect.top);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) onSave(blob);
    }, 'image/png');
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</label>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>
      <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 touch-none overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          className="w-full h-40 cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <p className="text-[10px] text-slate-400 font-medium text-center">Sign above using finger or stylus</p>
    </div>
  );
};