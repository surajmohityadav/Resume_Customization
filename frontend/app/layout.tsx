import { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'ResumeForge - AI Resume Toolkit',
  description: 'Build, customize, and analyze your resume to land your dream job.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeScript = `
    (function() {
      if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })()
  `;

  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}