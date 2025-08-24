'use client';
import { useState } from 'react';
import { ResumeEditor } from './ResumeEditor';
import { UserPrompt } from './UserPrompt';
import { DownloadButton } from './DownloadButton';

const aiTextToHtmlForDisplay = (text) => {
    if (!text) return { html: '' };
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    let html = '';
    const lines = processedText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return { html: '' };
    html += `<h1>${lines[0].replace(/<strong>|<\/strong>/g, '')}</h1>`;
    if (lines.length > 1) html += `<p>${lines[1]}</p>`;
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
    return { html };
};

export function ResumeEditorView({ originalContent, editedContent, setView }) {
  const [editedHtml, setEditedHtml] = useState(editedContent.html);
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [showComparison, setShowComparison] = useState(false);

  const originalHtmlForDisplay = aiTextToHtmlForDisplay(originalContent).html;

  return (
    <div className="min-h-screen bg-secondary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card p-8 rounded-lg shadow-2xl border border-border">
          <ResumeEditor content={editedHtml} setContent={setEditedHtml} />
          {editedContent.userPrompt && <UserPrompt promptText={editedContent.userPrompt} />}
          
          <div className="mt-6 border-t border-border pt-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/2">
                <label htmlFor="font-select" className="block text-sm font-medium text-muted-foreground">PDF Font Style</label>
                <select
                    id="font-select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-secondary text-foreground"
                >
                    <option>Helvetica</option>
                    <option>Times-Roman</option>
                    <option>Courier</option>
                </select>
              </div>
              <div className="w-full sm:w-1/2 pt-6 sm:pt-0">
                  <button onClick={() => setShowComparison(!showComparison)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors">
                      {showComparison ? 'Hide Comparison' : 'Compare Versions'}
                  </button>
              </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button onClick={() => setView('input')} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors">
              Back to Tools
            </button>
            <DownloadButton htmlContent={editedHtml} fontFamily={fontFamily} />
          </div>
        </div>

        {showComparison && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 fade-in-up">
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <h3 className="text-xl font-bold mb-4 text-center text-muted-foreground">Before</h3>
              <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: originalHtmlForDisplay }} />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
              <h3 className="text-xl font-bold mb-4 text-center text-primary">After</h3>
              <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: editedHtml }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}