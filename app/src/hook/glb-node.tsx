import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";

export function useGLTFFromArrayBuffer(buffer: ArrayBuffer | null) {
  const [url, setUrl] = useState<string | null>(null);

  // Convert ArrayBuffer to object URL once
  useEffect(() => {
    if (buffer) {
      const blob = new Blob([buffer], { type: "model/gltf-binary" });
      const objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [buffer]);

  const gltf = url ? useGLTF(url, true) : null; // only call useGLTF if url is valid

  return gltf;
}
