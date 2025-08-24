'use client';
import { useState } from 'react';
import api from '../../lib/api';
import { UploadResume } from './UploadResume';
import { JobDescription } from './JobDescription';
import { ScratchWizard } from './ScratchWizard';

const aiTextToHtml = (text) => {
    if (!text) return { html: '', userPrompt: null };
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const promptMarker = '---PROMPT_FOR_USER---';
    let content = processedText;
    let userPrompt = null;
    if (processedText.includes(promptMarker)) {
        const parts = processedText.split(promptMarker);
        content = parts[0];
        userPrompt = parts[1];
    }
    let html = '';
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return { html: '', userPrompt };
    html += `<h1>${lines[0].replace(/<strong>|<\/strong>/g, '')}</h1>`;
    if (lines.length > 1) html += `<p id="contact">${lines[1]}</p>`;
    let inList = false;
    for (let i = 2; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('<strong>')) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<h2>${line.replace(/<strong>|<\/strong>/g, '')}</h2>`;
        } else if (line.startsWith('* ')) {
            if (!inList) { html += '<ul>'; inList = true; }
            html += `<li>${line.substring(2)}</li>`;
        } else if (line) {
            if (inList) { html += '</ul>'; inList = false; }
            html += `<p>${line}</p>`;
        }
    }
    if (inList) html += '</ul>';
    return { html, userPrompt };
};

export function ResumeCustomizer({ setLoading, setError, loading, onFinish }) {
  const [mode, setMode] = useState('upload');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setFileName(selectedFile?.name || '');
  };

  const handleUploadSubmit = async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and provide a job description.');
      return;
    }
    setLoading(true); setError('');
    try {
      // Step 1: Get the original text first
      const textFormData = new FormData();
      textFormData.append('file', file);
      const textResponse = await api.post('/api/extract-text', textFormData);
      const originalText = textResponse.data.original_text;

      // Step 2: Get the customized version
      const customizeFormData = new FormData();
      customizeFormData.append('file', file);
      customizeFormData.append('job_description', jobDescription);
      const customizeResponse = await api.post('/api/upload-and-customize', customizeFormData);
      const customizedText = customizeResponse.data.customized_content;
      
      const { html, userPrompt } = aiTextToHtml(customizedText);
      // Pass both original and customized text to the final view
      onFinish(originalText, html, userPrompt);

    } catch (err) {
      setError('Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScratchFinish = (generatedContent) => {
    // For "scratch", the original is just the generated content
    const { html, userPrompt } = aiTextToHtml(generatedContent);
    onFinish(generatedContent, html, userPrompt);
  };

  return (
    <div className="fade-in-up">
      <div className="flex justify-center mb-6 border-b border-border">
        <button onClick={() => setMode('upload')} className={`px-6 py-3 font-bold ${mode === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Upload Resume</button>
        <button onClick={() => setMode('scratch')} className={`px-6 py-3 font-bold ${mode === 'scratch' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Start from Scratch</button>
      </div>
      {mode === 'upload' ? (
        <div className="space-y-6">
          <UploadResume onFileChange={handleFileChange} fileName={fileName} />
          <JobDescription onChange={setJobDescription} />
          <button onClick={handleUploadSubmit} disabled={loading || !file || !jobDescription} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg disabled:opacity-50">
            {loading ? 'Processing...' : 'Customize Resume'}
          </button>
        </div>
      ) : (
        <ScratchWizard onFinish={handleScratchFinish} setLoading={setLoading} setError={setError} loading={loading} />
      )}
    </div>
  );
}