"use client";

import { useRef, useState } from "react";

interface DragAndDropProps {
  onFilesSubmitted: (files: File[]) => void;
}

export default function DragAndDrop({ onFilesSubmitted }: DragAndDropProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const fileArray: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        fileArray.push(e.target.files[i]);
      }
      setFiles(fileArray);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileArray: File[] = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        fileArray.push(e.dataTransfer.files[i]);
      }
      setFiles(fileArray);
    }
  }

  function handleDragLeave(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(idx: number) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles(newArr);
  }

  function openFileExplorer() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  function handleSubmit() {
    if (files.length > 0) {
      onFilesSubmitted(files);
    } else {
      console.log("No files to submit.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center">
        <form
          className={`${
            dragActive ? "bg-blue-400" : "bg-gray-100"
          } p-6 w-full max-w-md rounded-lg border-2 dark:bg-slate-800 border-solid border-black dark:border-white text-center flex flex-col items-center justify-center`}
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={false}
            onChange={handleChange}
            accept=".png, .jpg, .jpeg"
            className="hidden"
          />
          <div className="flex items-center justify-center mb-3 space-x-2">
            <img
              src="/image_icon.png"
              alt="Upload Icon"
              className="w-12 h-12"
            />
            <p className="text-lg font-medium">
              Drag and drop or{" "}
              <span
                className="text-blue-600 font-semibold underline cursor-pointer hover:text-[#073559] rounded transition-colors duration-300 ease-in-out"
                onClick={openFileExplorer}
              >
                select files
              </span>{" "}
              to upload.
            </p>
          </div>
          <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
            (Files uploaded should be of type png, jpg or jpeg).
          </p>
          <div className="flex flex-col items-center">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center space-x-4 mb-2">
                <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
                <span
                  className="text-red-500 cursor-pointer"
                  onClick={() => removeFile(idx)}
                >
                  Remove
                </span>
              </div>
            ))}
          </div>
        </form>
        <button
          type="button"
          className="bg-[#073559] mt-4 text-white hover:bg-[#031f33] rounded px-4 py-2 transition-colors duration-300 ease-in-out"
          onClick={handleSubmit}
          disabled={files.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}