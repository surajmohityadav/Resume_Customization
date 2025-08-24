'use client';

import { useState } from 'react';
import axios from 'axios';
import { UploadResume } from './components/UploadResume';
import { JobDescription } from './components/JobDescription';
import { PreviewResume } from './components/PreviewResume';
import { DownloadButton } from './components/DownloadButton';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [customizedResume, setCustomizedResume] = useState('');
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_description', jobDescription);

      const response = await axios.post('http://localhost:8000/api/upload-and-customize', formData);
      setCustomizedResume(response.data.customized_content);
      setResumeId(response.data.id);
    } catch (err) {
      setError('Error customizing resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">AI Resume Customizer</h1>
        <div className="space-y-4">
          <UploadResume onFileChange={setFile} />
          <JobDescription onChange={setJobDescription} />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
            ) : 'Generate Custom Resume'}
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          {customizedResume && (
            <>
              <PreviewResume content={customizedResume} />
              {resumeId && <DownloadButton content={customizedResume} resumeId={resumeId} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}