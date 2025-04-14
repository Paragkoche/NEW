"use client";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Stage,
  useTexture,
} from "@react-three/drei";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { useConfig } from "@/context/configure-ctx";
import { useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { Fabric } from "@/types/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}/${url}`;
  const { scene } = useGLTF(fullUrl);
  return <primitive object={scene} dispose={null} />;
};

const DefaultMesh = ({ node, fabric }: { node: any; fabric?: Fabric }) => {
  const textureUrl = fabric?.url
    ? fabric.url.startsWith("http")
      ? fabric.url
      : `${process.env.NEXT_PUBLIC_API}/${fabric.url}`
    : null;

  // Load texture only if a fabric is provided
  const texture = useTexture(textureUrl || "");

  const material = useMemo(() => {
    const mat = node.material.clone(); // Clone to avoid shared references
    if (fabric && texture) {
      mat.map = texture;
      mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
      mat.map.repeat.set(fabric.size || 1, fabric.size || 1);
      mat.needsUpdate = true;
    }
    return mat;
  }, [texture, fabric]);

  return (
    <mesh
      key={crypto.randomUUID()}
      castShadow
      receiveShadow
      geometry={node.geometry}
      material={material}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    />
  );
};
const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: any[] }) => {
  const { scene, nodes } = useGLTF(
    glfUrl.startsWith("http") ? glfUrl : `${API_BASE_URL}/${glfUrl}`
  );
  const { selectedVariants, selectedFabric } = useConfig();

  return (
    <group scale={0.05}>
      {mashData.map((mash, index) => {
        const variantUrl = selectedVariants[mash.name];
        const meshNode = nodes[mash.name];
        console.log(meshNode);

        return (
          <Suspense fallback={null} key={`${mash.name}-${index}`}>
            {variantUrl ? (
              <VariantMesh url={variantUrl} />
            ) : (
              meshNode && (
                <DefaultMesh
                  node={meshNode}
                  fabric={selectedFabric || undefined}
                />
              )
            )}
          </Suspense>
        );
      })}
    </group>
  );
};

const ModelView = ({ model }: { model: any }) => (
  <Stage
    intensity={0.05}
    environment="studio"
    shadows={{
      type: "accumulative",
      bias: -0.0001,
      intensity: Math.PI,
    }}
    adjustCamera={false}
  >
    <Model glfUrl={`${API_BASE_URL}/${model.url}`} mashData={model.mash} />
  </Stage>
);

const ViewThreeD = (product: any) => {
  const { model, setConfig, bg, Config, envSelect } = useConfig();

  useEffect(() => {
    setConfig(product);
  }, [product]);

  if (!model) return null;

  return (
    <Canvas
      flat
      shadows={model.shadow ?? true}
      camera={{ position: [-15, 0, 10], fov: 30 }}
    >
      {/* Background & Lighting */}
      <color attach="background" args={[bg?.color || "#ffffff"]} />
      <ambientLight intensity={0.1} color={bg?.color || "#ffffff"} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={0.2}
        color={bg?.color || "#fffde0"}
        castShadow
      />

      {/* Model Rendering */}
      <ModelView model={model} />

      {/* Orbit Controls */}
      <OrbitControls
        autoRotate={model.autoRotate}
        autoRotateSpeed={model.RotationSpeed || 0.5}
        enableZoom
        zoomSpeed={0.5}
        minDistance={5}
        maxDistance={20}
        rotateSpeed={0.5}
        makeDefault
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />

      {/* Postprocessing */}
      <EffectComposer enableNormalPass={false}>
        <ToneMapping />
      </EffectComposer>

      {/* Environment */}
      {envSelect?.url ? (
        <Environment
          background
          files={`${API_BASE_URL}/${envSelect.url}`}
          blur={0.8}
        />
      ) : (
        <Environment background preset="sunset" blur={0.8} />
      )}
    </Canvas>
  );
};

export default ViewThreeD;
