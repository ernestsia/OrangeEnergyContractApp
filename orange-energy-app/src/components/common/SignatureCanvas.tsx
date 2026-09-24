import React, { useRef, useState, useEffect } from 'react';

interface SignatureCanvasProps {
  label: string;
  onConfirm: (blob: Blob) => void;
  onClear: () => void;
  existingUrl?: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  label,
  onConfirm,
  onClear,
  existingUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasSignature(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onClear();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    canvas.toBlob((blob) => {
      if (blob) onConfirm(blob);
    }, 'image/png');
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>

      {existingUrl && (
        <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <img src={existingUrl} alt="Captured Signature" className="max-h-32 mx-auto object-contain" />
          <p className="text-xs text-green-700 font-medium mt-1">✓ Signature Captured & Saved</p>
        </div>
      )}

      <div className="touch-none relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-44 rounded-lg cursor-crosshair"
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Clear Pad
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!hasSignature}
          className="px-4 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-lg shadow-sm transition-all"
        >
          Confirm Signature
        </button>
      </div>
    </div>
  );
};