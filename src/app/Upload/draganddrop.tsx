
/*
* TODO:
* Follow this tutorial later:
* https://github.com/InnocentAnyaele/Create-a-Drag-and-Drop-file-component-in-ReactJS-NextJS-Tailwind
* 
* 
* also need to include DragAndDrop in layout.tsx under defaultfunction rootlayout
* just look at where the <Navbar /> component is for context,
* 
* also also need to import it at the top of the layout.tsx page same way navbar is imported.
* 
* link to api when backend is configured
*/

"use client";

import { useRef, useState } from "react";

export default function DragAndDrop() {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const [files, setFiles] = useState<any>([]);

  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        setFiles((prevState: any) => [...prevState, e.target.files[i]]);
      }
    }
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        setFiles((prevState: any) => [...prevState, e.dataTransfer.files[i]]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleSubmitFile(e: any) {  
      if (files.length === 0) {  
        // no file has been submitted  
      } else {  
        // write submit logic here  
      }  
    }  

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile(idx: any) {
    const newArr = [...files];
    newArr.splice(idx, 1);
    setFiles(newArr);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center">
        <form
          className={`${
            dragActive ? "bg-blue-400" : "bg-gray-100"
          } p-6 w-full max-w-md rounded-lg border-2 dark:bg-slate-800 border-solid border-black dark:border-white text-center flex flex-col items-center justify-center`} // add a bg-[] with darkmode colours
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={true}
            onChange={handleChange}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />
          <div className="flex items-center justify-center mb-3 space-x-2">
            {/* Add the image next to the text */}
            <img
              src="/image_icon.png" // Replace this with the actual path to your image
              alt="Upload Icon"
              className="w-12 h-12"
            />
            <p className="text-lg font-medium">
              Drag and drop or{" "}
              <span
                className="text-blue-600 font-semibold underline cursor-pointer hover:text-[#073559] selection:bg-selection selection:text-white rounded transition-colors duration-300 ease-in-out"
                onClick={openFileExplorer}
              >
                select files
              </span>{" "}
              to upload.
            </p>
          </div>
          <p className="text-sm italic text-gray-500 dark:text-gray-400 mb-4">
            (Files uploaded should be of type pdf, png, jpg or jpeg).
          </p>
          <div className="flex flex-col items-center">
            {files.map((file: any, idx: any) => (
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
          onClick={() => {
            if (files.length > 0) {
              console.log("Submitting files:", files);
            } else {
              console.log("No files to submit.");
            }
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
