'use client';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // Import styles

interface Props {
  content: string;
  setContent: (content: string) => void;
}

export function ResumeEditor({ content, setContent }: Props) {
  // This is the crucial fix:
  // We use useMemo to ensure the dynamic import only happens once,
  // and it's done *inside* the component, which guarantees it only runs on the client.
  const ReactQuill = useMemo(() => 
    dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-3 text-foreground">Edit Your Resume</h3>
      <div className="bg-card">
        {/* The editor will now render correctly without crashing the server */}
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent}
          modules={modules}
        />
      </div>
    </div>
  );
}