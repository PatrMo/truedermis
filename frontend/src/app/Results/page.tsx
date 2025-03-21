"use client";

import { useEffect, useState } from 'react';
import Card from './card';
import { useRouter } from 'next/navigation';

interface Prediction {
  class: string;
  probability: number;
}

interface PredictionResult {
  predictions: Prediction[];
  topPrediction: Prediction;
}

export default function Results() {
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem('predictionResults');
    
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // If no results, redirect back to upload
      router.push('/Upload');
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">No Results Available</h1>
        <button
          onClick={() => router.push('/Upload')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="text-center mb-8">
        <h1 className="mt-10 text-4xl font-bold text-gray-800 dark:text-white">Analysis Results</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
          Here are the predictions for your uploaded image
        </p>
      </div>
      
      <Card predictions={results.predictions} />
      
      <div className="flex justify-center mt-8 mb-16">
        <button
          onClick={() => router.push('/Upload')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Upload Another Image
        </button>
      </div>
    </div>
  );
}