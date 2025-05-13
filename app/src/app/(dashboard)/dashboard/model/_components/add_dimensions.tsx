import { forwardRef, Ref, Suspense, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Dimensions } from "@/types/type";
import Dimension from "@/components/Dimension";
import { z } from "zod";
import { useWatch, useFormContext } from "react-hook-form";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { FormDataType } from "./form";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
const dimensionSchema = z.object({
  label: z.string().min(1),
  x: z.coerce.number(),
  y: z.coerce.number(),
  z: z.coerce.number(),
  end_x: z.coerce.number(),
  end_y: z.coerce.number(),
  end_z: z.coerce.number(),
});
type FileSource = {
  url: string;
  extension: "glb" | "obj";
};

function Model({ source }: { source: FileSource }) {
  const { url, extension } = source;
  console.log("sssssssssssssssssssss->sssssssss", url, extension);

  const object = useMemo(() => {
    if (extension === "obj") {
      return useLoader(OBJLoader, url);
    } else if (extension === "glb" || extension === "gltf") {
      return useGLTF(url).scene;
    }
    return null;
  }, [url, extension]);

  if (!object) return null;

  return <primitive object={object} scale={0.05} />;
}

export function ModelViewer({
  modelUrl,
  dimension,
}: {
  modelUrl: FileSource;
  dimension: z.infer<typeof dimensionSchema>[];
}) {
  return (
    <Canvas camera={{ position: [-15, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.0} />
      <Suspense fallback={null}>
        <Stage
          intensity={0.05}
          environment="studio"
          adjustCamera={false}
          shadows={{
            type: "accumulative",
            bias: -0.05, // Slight bias to control sharpness of shadows
            intensity: Math.PI, // Adjust intensity to simulate accumulation
            temporal: false, // abe bhai 3 month lega debug kar ne ko fuck!!
          }}
          castShadow
        >
          <Model source={modelUrl} />
        </Stage>
        {dimension.map((dim, index) => (
          <Dimension
            key={index}
            start={[dim.x, dim.y, dim.z]}
            end={[dim.end_x, dim.end_y, dim.end_z]}
            label={dim.label}
          />
        ))}
      </Suspense>
      <OrbitControls
        enableZoom
        zoomSpeed={0.5}
        minDistance={5}
        maxDistance={20}
        rotateSpeed={0.5}
        makeDefault
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
      <EffectComposer enableNormalPass={true}>
        <ToneMapping />
      </EffectComposer>
    </Canvas>
  );
}
