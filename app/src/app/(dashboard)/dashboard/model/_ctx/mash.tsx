import { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

type ModelResult = {
  object: any | null;
  url: string | null;
};

export function use3DModelFromFile(file: File | null): ModelResult {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [extension, setExtension] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    setExtension(ext || null);

    (async () => {
      const blob = new Blob([await file.arrayBuffer()], {
        type:
          ext === "glb"
            ? "model/gltf-binary"
            : ext === "gltf"
            ? "model/gltf+json"
            : "text/plain", // fallback for .obj
      });
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const gltf =
    objectUrl && (extension === "glb" || extension === "gltf")
      ? useGLTF(objectUrl, true)
      : null;
  const obj =
    objectUrl && extension === "obj" ? useLoader(OBJLoader, objectUrl) : null;

  return {
    object: gltf?.scene ?? obj ?? null,
    url: objectUrl,
  };
}
