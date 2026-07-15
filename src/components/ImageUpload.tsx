'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  value?: string | null;
}

export default function ImageUpload({ onUploadComplete, onRemove, value }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API || 'd5a7aedab2c861ca5dec9ae71691ace7';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    // Validate is image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (png, jpg, webp, etc.)');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const responseData = await res.json();
      if (responseData.success && responseData.data?.url) {
        onUploadComplete(responseData.data.url);
      } else {
        throw new Error(responseData.error?.message || 'Failed to retrieve image URL');
      }
    } catch (err: any) {
      console.error('ImageUpload error:', err);
      setError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-sm border border-outline/10 bg-surface-container-low group">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove();
            }}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black text-white rounded-lg transition-colors shadow-md active:scale-95"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`cursor-pointer border-2 border-dashed transition-all rounded-xl p-8 bg-background/50 flex flex-col items-center justify-center text-center gap-3 min-h-[220px] group ${
            dragActive
              ? 'border-primary bg-primary/5 ring-1 ring-primary'
              : 'border-outline/25 hover:border-primary/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-3 text-secondary">
              <svg
                className="animate-spin h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-xs font-label-bold">Uploading to ImgBB...</p>
            </div>
          ) : (
            <>
              <UploadCloud
                className="text-outline group-hover:text-primary transition-colors duration-300"
                size={36}
              />
              <div className="space-y-1">
                <p className="text-xs font-label-bold text-primary group-hover:underline">
                  Click to upload or drag & drop
                </p>
                <p className="text-[10px] text-outline font-body-md">
                  Supports PNG, JPG, WEBP (Max 32MB)
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-error mt-2">
              <AlertCircle size={14} />
              <span className="text-[11px] font-label-bold uppercase">{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
