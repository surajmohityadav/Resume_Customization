'use client';
import { ChangeEvent, useRef } from 'react';

interface Props {
  onFileChange: (file: File | null) => void;
  fileName: string;
}

export function UploadResume({ onFileChange, fileName }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-muted-foreground">
        Your Resume (.pdf, .docx)
      </label>
      <div 
        onClick={handleClick}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
      >
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-muted-foreground">
            <span className="relative bg-card rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none">
              <span>Upload a file</span>
              <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx"/>
            </span>
            <p className="pl-1">or drag and drop</p>
          </div>
          {fileName ? (
            <p className="text-sm text-foreground">{fileName}</p>
          ) : (
            <p className="text-xs text-muted-foreground">PDF, DOCX up to 10MB</p>
          )}
        </div>
      </div>
    </div>
  );
}