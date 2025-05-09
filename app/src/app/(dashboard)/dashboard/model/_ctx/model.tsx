import { useState, useCallback } from "react";

export const useModelUrl = () => {
  const [modelUrl, setModelUrl] = useState<File | null>(null);

  const updateModelUrl = useCallback((file: File) => {
    console.log(file);

    setModelUrl(file);
  }, []);

  const clearModelUrl = useCallback(() => {
    setModelUrl(null);
  }, []);

  return {
    modelUrl,
    updateModelUrl,
    clearModelUrl,
  };
};
