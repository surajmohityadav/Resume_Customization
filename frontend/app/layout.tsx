import '../styles/globals.css'; // Adjusted path: go up one level to frontend/, then into styles/import { ReactNode } from 'react';

export const metadata = {
  title: 'AI Resume Customizer',
  description: 'Customize your resume for job applications',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}