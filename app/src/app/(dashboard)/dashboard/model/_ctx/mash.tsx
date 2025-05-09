import { useEffect, useMemo, useState } from "react";
import { useGLTF } from "@react-three/drei";

export function useGLTFFromArrayBuffer(buffer: File | null) {
  const [url, setUrl] = useState<string | null>(null);

  // Convert ArrayBuffer to object URL once
  useEffect(() => {
    if (buffer) {
      (async () => {
        const blob = new Blob([await buffer.arrayBuffer()], {
          type: "model/gltf-binary",
        });
        const objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })();

      //   return () => {
      //     URL.revokeObjectURL(objectUrl);
      //   };
    }
  }, [buffer]);

  const gltf = url ? useGLTF(url, true) : null; // only call useGLTF if url is valid

  return gltf;
}
