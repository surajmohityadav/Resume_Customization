import { ChangeEvent } from 'react';

interface Props {
  onChange: (value: string) => void;
}

export function JobDescription({ onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2 text-gray-700">Job Description</label>
      <textarea
        onChange={handleChange}
        className="border rounded-lg p-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-green-300 bg-gray-50"
        placeholder="Paste job description here..."
      />
    </div>
  );
}