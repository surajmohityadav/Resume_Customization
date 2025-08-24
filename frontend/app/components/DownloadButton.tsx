'use client';
import api from '../../lib/api';

export function DownloadButton({ htmlContent, fontFamily }) {
  const handleDownload = async () => {
    try {
      const response = await api.post('/api/download-pdf', 
        { 
          html_content: htmlContent, 
          font_family: fontFamily 
        },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Customized_Resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download resume');
    }
  };

  return (
    <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-bold">
      <i className="fas fa-download"></i> Download as PDF
    </button>
  );
}