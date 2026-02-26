'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FileUploadProps {
  bucket: string;
  folder?: string;
  accept?: string;
  onUploaded: (url: string) => void;
  currentUrl?: string;
}

export default function FileUpload({
  bucket,
  folder = '',
  accept = 'image/*',
  onUploaded,
  currentUrl,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const url = urlData.publicUrl;

      setPreview(url);
      onUploaded(url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
  };

  const handleClear = () => {
    setPreview(null);
    onUploaded('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          {accept.includes('image') ? (
            <div className="relative h-32 w-32 border border-border bg-background overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="border border-border bg-background px-4 py-2 text-xs text-muted">
              파일 업로드 완료
            </div>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-accent text-white text-xs"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-3 text-sm text-muted hover:border-primary transition-colors">
          <Upload size={16} />
          {uploading ? '업로드 중...' : '파일 선택'}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
