'use client';
import { ChangeEvent } from 'react';

interface Props {
  onChange: (value: string) => void;
}

export function JobDescription({ onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="job-description" className="block text-sm font-medium mb-1 text-muted-foreground">
        Job Description
      </label>
      <textarea
        id="job-description"
        onChange={handleChange}
        className="shadow-sm block w-full sm:text-sm rounded-md focus:ring-primary focus:border-primary bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-500"
        rows={8}
        placeholder="Paste the full job description here..."
      />
    </div>
  );
}