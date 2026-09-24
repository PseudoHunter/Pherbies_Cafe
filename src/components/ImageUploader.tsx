import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle, Link } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  recommendedDimensions?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  recommendedDimensions = 'Recommended: JPG, PNG, WEBP (Landscape or Square)',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  // Compress and resize image client-side to ensure smooth local storage & database persistence
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Max dimension 1200px for sharp high-DPI display without massive payload
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.85 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(src);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setError('Failed to read image. Please try another file.');
        setIsProcessing(false);
      };
      img.src = src;
    };
    reader.onerror = () => {
      setError('Error reading file from disk.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasValidImage = Boolean(value && typeof value === 'string' && value.trim() !== '');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#3D2619]">{label} *</label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[11px] text-[#D97746] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Link className="w-3 h-3" />
          <span>{showUrlFallback ? 'Hide URL input' : 'Paste URL instead'}</span>
        </button>
      </div>

      {/* Main File Upload Dropzone / Preview Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
          isDragging
            ? 'border-[#E07A5F] bg-[#FCEADE]/40 scale-[1.01]'
            : hasValidImage
            ? 'border-[#E8D7C8] bg-[#FDF6EC]/30 hover:border-[#D97746]'
            : 'border-[#E8D7C8] hover:border-[#E07A5F] bg-[#FFFBF5] hover:bg-[#FDF6EC]/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {hasValidImage ? (
          /* Preview state */
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-zinc-100 border border-[#E8D7C8] shrink-0 group">
              <img
                src={value.trim()}
                alt="Upload preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-rose-600 text-white flex items-center justify-center transition"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Image selected &amp; ready</span>
              </div>
              <p className="text-[11px] text-[#5C3A21]/75">
                Click anywhere in this box or drag &amp; drop to replace with another photo.
              </p>
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-[#FDF6EC] hover:bg-[#F7EEDB] border border-[#E8D7C8] text-[11px] font-bold text-[#3D2619] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-[#D97746]" />
                  <span>Choose Another File</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state / drop prompt */
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6EC] border border-[#F0DDC8] flex items-center justify-center text-[#D97746] shadow-2xs">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#E07A5F]" />
              ) : (
                <Upload className="w-6 h-6 text-[#E07A5F]" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-[#3D2619]">
                {isProcessing
                  ? 'Optimizing and loading image...'
                  : 'Click to upload or drag & drop photo here'}
              </p>
              <p className="text-[11px] text-[#5C3A21]/70 mt-0.5">
                {recommendedDimensions}
              </p>
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-[#E07A5F] text-white text-[10px] font-bold shadow-xs">
              Browse Files
            </span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Optional fallback input if user prefers to paste a direct URL */}
      {showUrlFallback && (
        <div className="pt-1">
          <input
            type="text"
            placeholder="Or paste direct image URL (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#E8D7C8] text-xs font-mono bg-[#FFFBF5]"
          />
        </div>
      )}
    </div>
  );
};
