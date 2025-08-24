// frontend/app/components/UserPrompt.tsx
'use client';

interface Props {
  promptText: string;
}

export function UserPrompt({ promptText }: Props) {
  // Split the text into individual questions/prompts
  const prompts = promptText.split('\n').filter(line => line.trim() !== '' && !line.startsWith('---'));

  return (
    <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.636-1.213 2.85-1.213 3.486 0l5.58 10.656c.636 1.213-.474 2.745-1.743 2.745H4.42c-1.269 0-2.379-1.532-1.743-2.745L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.008a1 1 0 011 1v2a1 1 0 01-1 1h-.008a1 1 0 01-1-1V8z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-yellow-800">Your resume is good, but could be better!</p>
          <div className="mt-2 text-sm text-yellow-700">
            <p>The AI suggests adding details about the following skills from the job description:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {prompts.map((prompt, index) => (
                <li key={index}>{prompt}</li>
              ))}
            </ul>
             <p className="mt-3">Consider adding these to your 'Experience' or 'Skills' section in the editor above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}