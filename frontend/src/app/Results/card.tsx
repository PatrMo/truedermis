"use client";

import React, { useState, useCallback, useRef } from 'react';
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

interface CardItem {
  img: string;
  title: string;
  text: string;
}

const diseases: CardItem[] = [
  {
    img: "/images/1.jpg",
    title: "Create a website using Html CSS and JavaScript",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/2.jpg",
    title: "Complete portfolio website tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/3.jpg",
    title: "Bootstrap 5 Complete tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/4.jpg",
    title: "UIkit Complete tutorial",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/5.jpg",
    title: "Tailwind CSS card design",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/6.jpg",
    title: "Reactjs tutorial for beginner",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/7.jpg",
    title: "Nextjs crash course",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/8.jpg",
    title: "Create a website using Tailwind CSS",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
  {
    img: "/images/9.jpg",
    title: "Create a one-page website using ReactJS",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
  },
];

/*Change the line below to "const Card: React.FC = async () => {" when its finally ready, this was reverted for testing purposes*/
const Card: React.FC = () => {
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
  //Reset handler
  const handleReset = () => {
    setImagePreview(null);
    setFileName('');
    setPredictions([]);
    setError(null);
  };

  return (
    <nav className="mt-24">
      <div className="flex flex-col gap-8 w-full px-4 sm:px-10 lg:px-20 pb-16"> 
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">Processing...</div>
          </div>
        ) : error ? (
          <div className="mt-2 text-red-600">{error}</div>
        ) : predictions.length > 0 ? (
        {/* Added pb-16 here for bottom spacing */}
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="w-full flex flex-col items-center justify-center text-center border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 
                       bg-white text-gray-900 border-gray-300 
                       dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
          >
            <h3 className="text-3xl font-semibold dark:text-white">{disease.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">{disease.text}</p>
          </div>
        ))}
      ) : (
        <p className="text-gray-500 mt-2">Waiting for analysis...</p>
      )}
      </div>
    </nav>
  );
};

export default Card;