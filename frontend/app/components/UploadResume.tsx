import { ChangeEvent } from 'react';

interface Props {
  onFileChange: (file: File | null) => void;
}

export function UploadResume({ onFileChange }: Props) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
        </svg>
        Upload Resume (PDF/DOCX)
      </label>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
}