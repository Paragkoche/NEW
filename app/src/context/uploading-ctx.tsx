"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
interface UploadingContextType {
  MainModel: File | null;
  addFile: (newModel: File) => void;
  clearFiles: () => void;
}

const UploadingContext = createContext<UploadingContextType | undefined>(
  undefined
);

export const UploadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [MainModel, setMainModel] = useState<File | null>(null);
  const [glb, setGlb] = useState<ProgressEvent<EventTarget> | null>(null);

  const addFile = async (newModal: File) => {
    setMainModel(newModal);
    const arrayBuffer = await newModal.arrayBuffer();
    const loader = new GLTFLoader();
    const blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);
    loader.loadAsync(url, (loadedGltf) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(
        "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
      );
      loader.setDRACOLoader(dracoLoader);

      console.log("GLTF loaded:", loadedGltf);
      setGlb(loadedGltf);
      URL.revokeObjectURL(url); // Clean up the URL after use
    });
  };
  console.log(glb);

  const clearFiles = () => {
    setMainModel(null);
  };

  return (
    <UploadingContext.Provider value={{ MainModel, addFile, clearFiles }}>
      {children}
    </UploadingContext.Provider>
  );
};

export const useUploadingContext = (): UploadingContextType => {
  const context = useContext(UploadingContext);
  if (!context) {
    throw new Error(
      "useUploadingContext must be used within an UploadingProvider"
    );
  }
  return context;
};
