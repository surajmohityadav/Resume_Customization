'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { ATSCalculator } from './components/ATSCalculator';
import { SkillExtractor } from './components/SkillExtractor';
import { ResumeCustomizer } from './components/ResumeCustomizer';

// Dynamically import the entire editor view with SSR turned off
const ResumeEditorView = dynamic(
  () => import('./components/ResumeEditorView').then(mod => mod.ResumeEditorView),
  { 
    ssr: false,
    loading: () => <p className="text-center p-8">Loading Editor...</p> 
  }
);

export default function Home() {
  const [activeTool, setActiveTool] = useState('customizer');
  const [view, setView] = useState('input');
  const [editorContent, setEditorContent] = useState({ html: '', userPrompt: null });
  const [originalContent, setOriginalContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tools = [
    { id: 'customizer', name: 'Resume Customizer', icon: 'fa-wand-magic-sparkles' },
    { id: 'ats', name: 'ATS Score', icon: 'fa-magnifying-glass-chart' },
    { id: 'skills', name: 'Skill Extractor', icon: 'fa-tags' },
  ];

  const handleProcessFinish = (rawText, html, userPrompt) => {
    setOriginalContent(rawText);
    setEditorContent({ html, userPrompt });
    setView('editor');
  };

  if (view === 'editor') {
    return <ResumeEditorView 
              originalContent={originalContent} 
              editedContent={editorContent} 
              setView={setView} 
            />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="max-w-4xl mx-auto text-center px-4 fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">The Ultimate AI Resume Toolkit</h1>
          <p className="mt-4 text-lg text-muted-foreground">Build, customize, and analyze your resume to land your dream job.</p>
        </section>

        <section className="mt-12 max-w-4xl mx-auto px-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card rounded-2xl shadow-2xl p-6 sm:p-8 border border-border">
            <div className="flex justify-center mb-6 border-b border-border">
              {tools.map(tool => (
                <button key={tool.id} onClick={() => setActiveTool(tool.id)}
                  className={`px-4 py-3 font-bold flex items-center gap-2 transition-colors ${activeTool === tool.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <i className={`fas ${tool.icon}`}></i> {tool.name}
                </button>
              ))}
            </div>
            
            {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
            
            {activeTool === 'customizer' && <ResumeCustomizer setLoading={setLoading} setError={setError} loading={loading} onFinish={handleProcessFinish} />}
            {activeTool === 'ats' && <ATSCalculator setLoading={setLoading} setError={setError} loading={loading} />}
            {activeTool === 'skills' && <SkillExtractor setLoading={setLoading} setError={setError} loading={loading} />}
          </div>
        </section>
      </main>
    </div>
  );
}