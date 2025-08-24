'use client';
import { useState } from 'react';
import api from '../../lib/api';

export function ATSCalculator({ setLoading, setError, loading }) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!resumeText || !jobDescription) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const response = await api.post('/api/calculate-ats-score', { resume_text: resumeText, job_description: jobDescription });
      setResult(response.data);
    } catch (err) {
      setError("Failed to calculate score. Please try again.");
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
        className="w-full h-32 p-3 border rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary" 
      />
      <textarea 
        value={jobDescription} 
        onChange={(e) => setJobDescription(e.target.value)} 
        placeholder="Paste the job description here..." 
        className="w-full h-32 p-3 border rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary" 
      />
      <button onClick={handleSubmit} disabled={loading} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg disabled:opacity-50 transition-colors hover:bg-primary/90">
        {loading ? 'Calculating...' : 'Calculate ATS Score'}
      </button>
      {result && (
        <div className="p-4 bg-secondary rounded-lg fade-in-up border border-border">
          <h3 className="font-bold text-lg mb-2 text-foreground">Analysis Result:</h3>
          <p className="text-2xl font-bold text-primary">{result.score}/10</p>
          <div className="mt-2">
            <h4 className="font-semibold text-green-500">Matching Skills:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">{result.matching_skills.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
          <div className="mt-2">
            <h4 className="font-semibold text-red-500">Missing Skills:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground">{result.missing_skills.map(s => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
}