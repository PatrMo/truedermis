"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Image from 'next/image';

// Define types
interface Prediction {
  class: string;
  probability: number;
}

interface PredictionResult {
  predictions: Prediction[];
  topPrediction: Prediction;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  // State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // File drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setFileName(file.name);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload and predict
    uploadImage(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Handle image upload and prediction
  const uploadImage = async (file: File) => {
    setIsLoading(true);
    setPredictions([]);
    setError(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      console.log("check");
      // Send to API
      const response = await axios.post<PredictionResult>(
        `${API_URL}/predict`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      // Update state with results
      console.log("check");
      setPredictions(response.data.predictions);
    } catch (err) {
      console.error('Error predicting image:', err);
      setError('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the form
  const handleReset = () => {
    setImagePreview(null);
    setFileName('');
    setPredictions([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="mt-3 text-xl text-gray-500">
            Upload an image to get instant skin condition classification
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Image upload section */}
            {!imagePreview ? (
              <div 
                {...getRootProps()} 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input {...getInputProps()} className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row">
                  {/* Image preview */}
                  <div className="sm:w-1/2 mb-4 sm:mb-0 sm:pr-4">
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                      {imagePreview && (
                        <Image
                          src={imagePreview}
                          alt="Uploaded skin image"
                          layout="fill"
                          objectFit="contain"
                        />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">{fileName}</p>
                  </div>

                  {/* Results section */}
                  <div className="sm:w-1/2 sm:pl-4">
                    <h3 className="text-lg font-medium text-gray-900">Results</h3>
                    
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="loader">Processing...</div>
                      </div>
                    ) : error ? (
                      <div className="mt-2 text-red-600">{error}</div>
                    ) : predictions.length > 0 ? (
                      <div className="mt-4 space-y-4">
                        {predictions.map((prediction, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md ${index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{prediction.class}</span>
                              <span className="text-sm font-bold">
                                {(prediction.probability * 100).toFixed(2)}%
                              </span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${index === 0 ? 'bg-green-600' : 'bg-blue-500'}`}
                                style={{ width: `${prediction.probability * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 mt-2">Waiting for analysis...</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information section */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">About This Tool</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This application uses a deep learning model trained on dermatological images.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500">
              <strong>Disclaimer:</strong> This tool is for educational purposes only and should not be used for
              self-diagnosis. Always consult a healthcare professional for proper diagnosis and treatment of skin conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}