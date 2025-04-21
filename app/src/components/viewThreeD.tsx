// @typescript-eslint/no-unused-vars
"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import {
  useGLTF,
  Stage,
  OrbitControls,
  Environment,
  useEnvironment,
  useProgress,
  Html,
} from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { useConfig } from "@/context/configure-ctx";
import { Fabric, Mash, Model as ModelType, Product } from "@/types/config";
import { Suspense, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}/${url}`;
  const { scene } = useGLTF(fullUrl);

  return <primitive key={fullUrl} object={scene} dispose={null} />;
};

const DefaultMesh = ({ node, fabric }: { node: any; fabric?: Fabric }) => {
  const clone = node.material;

  if (fabric && node.material && fabric.url) {
    const fabricTexture = useLoader(
      THREE.TextureLoader,
      `${API_BASE_URL}/${fabric.url}`,
      (load) => {
        load.crossOrigin = "anonymous";
      }
    );
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(fabric.size || 1, fabric.size || 1);

    node.material.map = fabricTexture;
    node.material.needsUpdate = true;
  } else if (node.material) {
    node.material.map = null;
    node.material.needsUpdate = true;
  }

  return (
    <mesh
      key={uuidv4()}
      castShadow
      receiveShadow
      geometry={node.geometry}
      material={node.material}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    />
  );
};
import { Line, Text } from "@react-three/drei";

const Dimension = ({
  start,
  end,
  label,
}: {
  start: [number, number, number];
  end: [number, number, number];
  label: string;
}) => {
  const mid = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 0.1, // offset label a bit
    (start[2] + end[2]) / 2,
  ];

  return (
    <>
      <Line
        points={[start, end]}
        color="black"
        lineWidth={1}
        dashed
        dashSize={0.05}
        gapSize={0.05}
      />
      <Text fontSize={0.1} color="black">
        {label}
      </Text>
    </>
  );
};

const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: Mash[] }) => {
  const baseUrl = glfUrl.startsWith("http")
    ? glfUrl
    : `${API_BASE_URL}/${glfUrl}`;
  const { nodes } = useGLTF(baseUrl);
  const { selectedVariants, selectedFabrics } = useConfig();

  return (
    <group scale={0.05}>
      {mashData.map((mash, index) => {
        const variantUrl = selectedVariants[mash.name];
        const mashKey = mash.name;

        // 🔁 Get the fabric for this specific mesh
        const fabric: Fabric | undefined =
          mash.textureEnable && selectedFabrics[mashKey]
            ? {
                ...selectedFabrics[mashKey],
              }
            : undefined;

        return (
          <Suspense fallback={null} key={mashKey + index}>
            {variantUrl ? (
              <VariantMesh url={variantUrl} />
            ) : (
              nodes[mashKey] && (
                <DefaultMesh
                  node={nodes[mashKey]}
                  fabric={fabric && mash.textureEnable ? fabric : undefined}
                />
              )
            )}
          </Suspense>
        );
      })}
    </group>
  );
};
const ModelView = ({ model }: { model: ModelType }) => (
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
    <Suspense fallback={<Loader />}>
      <Model glfUrl={`${API_BASE_URL}/${model.url}`} mashData={model.mash} />
    </Suspense>
  </Stage>
);

// const ENV = () => {
//   const { envSelect } = useConfig();

//   if (envSelect) {
//     const hdrUrl = envSelect?.url
//       ? `${API_BASE_URL}/${envSelect.url}`
//       : "https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/venice_sunset_1k.hdr";

//     const envMap = useEnvironment({ files: hdrUrl });

//     return <Environment background map={envMap} blur={0.7} />;
//   }

//   return <Environment background preset="sunset" blur={0.7} />;
// };

const ENV = () => {
  const { envSelect } = useConfig();

  const hdrUrl = envSelect?.url ? `${API_BASE_URL}/${envSelect.url}` : null;

  return hdrUrl && <Environment background files={hdrUrl} blur={0.7} />;
};
const Loader = () => {
  const { progress, active } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      setLoading(false);
    }
  }, [progress]);

  return loading ? (
    <Html center>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50 bg-black bg-opacity-80 p-6 rounded-xl flex flex-col items-center justify-center">
        <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white text-lg">Loading {Math.floor(progress)}%</p>
      </div>
    </Html>
  ) : null;
};
const ViewThreeD = (pops: Product) => {
  const { model, setConfig, bg } = useConfig();

  useEffect(() => {
    setConfig(pops);
  }, [pops]);

  return (
    model && (
      <Canvas
        flat
        shadows={model.shadow ?? true}
        camera={{ position: [-15, 0, 10], fov: 30 }}
      >
        <Suspense fallback={<Loader />}>
          <color attach="background" args={[bg?.color || "#FFFFF"]} />
          <ambientLight intensity={0.0} color={bg?.color || "#FFFFFF"} />
          <directionalLight
            position={[0, 0, 0]}
            intensity={0.05}
            color={bg?.color || "#FFFDE0"}
            castShadow
          />

          <ModelView model={model} />

          <OrbitControls
            autoRotate={model.autoRotate}
            autoRotateSpeed={model.RotationSpeed || 0.5}
            enableZoom={true}
            zoomSpeed={0.5}
            minDistance={5}
            maxDistance={20}
            rotateSpeed={0.5}
            makeDefault
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />

          <EffectComposer enableNormalPass={false}>
            <ToneMapping />
          </EffectComposer>

          <ENV />
        </Suspense>
      </Canvas>
    )
  );
};

export default ViewThreeD;
