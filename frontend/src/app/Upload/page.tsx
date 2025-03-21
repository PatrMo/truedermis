"use client";

import React, { useState } from "react";
import DragAndDrop from "./draganddrop";
import { useRouter } from "next/navigation";

export default function Upload() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const file = files[0]; // Take the first file
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Send to API
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      
      const data = await response.json();
      
      // Store the results in sessionStorage to pass to Results page
      sessionStorage.setItem('predictionResults', JSON.stringify(data));
      
      // Navigate to results page
      router.push('/Results');
    } catch (err) {
      console.error('Error predicting image:', err);
      setError('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 mx-auto max-w-md">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg">Processing image...</p>
        </div>
      ) : (
        <DragAndDrop onFilesSubmitted={handleFileUpload} />
      )}
    </div>
  );
}