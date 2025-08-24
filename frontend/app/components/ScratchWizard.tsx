// frontend/app/components/ScratchWizard.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';

interface Props {
  onFinish: (generatedHtml: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  loading: boolean;
}

const steps = ["Job Description", "Personal Info", "Experience", "Education", "Skills"];

export function ScratchWizard({ onFinish, setLoading, setError, loading }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    "Job Description": "",
    "Full Name": "",
    "Contact Info": "",
    "Experience": "",
    "Education": "",
    "Skills": ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
        const payload = {
            job_description: formData["Job Description"],
            user_details: {
                "Full Name": formData["Full Name"],
                "Contact Info": formData["Contact Info"],
                "Experience": formData["Experience"],
                "Education": formData["Education"],
                "Skills": formData["Skills"],
            }
        };
        const response = await axios.post('http://localhost:8000/api/build-from-scratch', payload);
        onFinish(response.data.customized_content);
    } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to build resume.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-center">Step {currentStep + 1}: {steps[currentStep]}</h3>
      
      {currentStep === 0 && <textarea name="Job Description" value={formData["Job Description"]} onChange={handleChange} placeholder="First, paste the job description here..." className="w-full h-40 p-2 border rounded" />}
      {currentStep === 1 && (
        <>
          <input name="Full Name" value={formData["Full Name"]} onChange={handleChange} placeholder="Your Full Name" className="w-full p-2 border rounded" />
          <input name="Contact Info" value={formData["Contact Info"]} onChange={handleChange} placeholder="Email, Phone, LinkedIn URL" className="w-full p-2 border rounded" />
        </>
      )}
      {currentStep === 2 && <textarea name="Experience" value={formData["Experience"]} onChange={handleChange} placeholder="Describe your work experience. What were your key achievements?" className="w-full h-40 p-2 border rounded" />}
      {currentStep === 3 && <textarea name="Education" value={formData["Education"]} onChange={handleChange} placeholder="Your degrees, universities, and graduation dates." className="w-full h-40 p-2 border rounded" />}
      {currentStep === 4 && <textarea name="Skills" value={formData["Skills"]} onChange={handleChange} placeholder="List your technical and soft skills." className="w-full h-40 p-2 border rounded" />}

      <div className="flex justify-between">
        {currentStep > 0 && <button onClick={handleBack} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Back</button>}
        {currentStep < steps.length - 1 && <button onClick={handleNext} className="bg-green-500 text-white font-bold py-2 px-4 rounded">Next</button>}
        {currentStep === steps.length - 1 && <button onClick={handleSubmit} disabled={loading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded">{loading ? 'Building...' : 'Build Resume'}</button>}
      </div>
    </div>
  );
}