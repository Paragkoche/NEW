"use client";
import { useUploadingContext } from "@/context/uploading-ctx";
import React from "react";

const InputBox = () => {
  const { addFile } = useUploadingContext();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files)[0];
    addFile(droppedFiles);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    addFile(selectedFiles[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="w-[80%] h-[80%] border border-dashed rounded-4xl flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        className="hidden"
        type="file"
        accept=".glb,.obj"
        onChange={handleFileChange}
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        Drag & Drop files here or click to upload
      </label>
      {/* <ul className="mt-4">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default InputBox;
