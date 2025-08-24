'use client';
import { useState } from 'react';
import api from '../../lib/api';

export function SkillExtractor({ setLoading, setError, loading }) {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!resumeText) {
      setError("Please provide your resume text.");
      return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await api.post('/api/extract-skills', { resume_text: resumeText });
      setResult(response.data);
    } catch (err) {
      setError("Failed to extract skills. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <textarea 
        value={resumeText} 
        onChange={(e) => setResumeText(e.target.value)} 
        placeholder="Paste your full resume text here..." 
        className="w-full h-40 p-3 border rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary" 
      />
      <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg disabled:opacity-50 transition-colors hover:bg-primary/90">
        {loading ? 'Extracting...' : 'Extract Skills'}
      </button>
      {result && (
        <div className="p-4 bg-secondary rounded-lg fade-in-up border border-border">
          <h3 className="font-bold text-lg mb-2 text-foreground">Extracted Skills:</h3>
          <div className="mt-2">
            <h4 className="font-semibold text-foreground">Technical Skills:</h4>
            <p className="text-sm text-muted-foreground">{result.technical_skills.join(', ')}</p>
          </div>
          <div className="mt-2">
            <h4 className="font-semibold text-foreground">Soft Skills:</h4>
            <p className="text-sm text-muted-foreground">{result.soft_skills.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}