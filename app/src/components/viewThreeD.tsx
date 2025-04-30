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
import { Fabric, Mash, Model as ModelType, Product } from "@/types/type";
import { Suspense, useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `/${url}`;
  const { scene } = useGLTF(fullUrl);

  return <primitive key={fullUrl} object={scene} dispose={null} />;
};

const DefaultMesh = ({ node, fabric }: { node: any; fabric?: Fabric }) => {
  const clonedMaterial = node.material.clone();
  console.log("():::()", fabric);

  if (fabric && fabric.url) {
    const fabricTexture = useLoader(
      THREE.TextureLoader,
      `${fabric.url}`,
      (loader) => {
        loader.crossOrigin = "anonymous";
      }
    );
    fabricTexture.wrapS = THREE.RepeatWrapping;
    fabricTexture.wrapT = THREE.RepeatWrapping;
    fabricTexture.repeat.set(fabric.size || 1, fabric.size || 1);
    clonedMaterial.map = fabricTexture;
  } else {
    clonedMaterial.map = null;
  }

  clonedMaterial.needsUpdate = true;

  return (
    <mesh
      key={uuidv4()}
      castShadow
      receiveShadow
      geometry={node.geometry}
      material={clonedMaterial}
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
  const baseUrl = glfUrl.startsWith("http") ? glfUrl : `/${glfUrl}`;
  const { nodes } = useGLTF(baseUrl);
  const { selectedVariants, selectedFabrics } = useConfig();

  return (
    <group scale={0.05}>
      {mashData.map((mash, index) => {
        const mashKey = mash.mashName;
        const fabric = mash.textureEnable
          ? selectedFabrics[mashKey]
          : undefined;

        const shouldShowVariant =
          selectedVariants && selectedVariants.mashName === mashKey;

        return (
          <Suspense fallback={null} key={mashKey + index}>
            {shouldShowVariant && selectedVariants.url ? (
              <VariantMesh url={selectedVariants.url} />
            ) : nodes[mashKey] ? (
              <DefaultMesh node={nodes[mashKey]} fabric={fabric} />
            ) : null}
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
      <Model glfUrl={`${model.url}`} mashData={model.mash} />
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
  const { selectedEnv } = useConfig();

  const hdrUrl = selectedEnv?.url ? `${selectedEnv.url}` : null;

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
  const {
    changeSelectedModel,
    selectedModel,
    selectedBg,
    setBgs,
    setModel,
    setFabricRageForVariant,
  } = useConfig();

  useEffect(() => {
    if (pops) {
      changeSelectedModel(pops.model[0]);
      setModel(pops.model);
      setBgs(pops.bgs);
    }
  }, [pops]);
  return (
    selectedModel && (
      <Canvas
        shadows={selectedModel.shadow ?? true}
        camera={{ position: [-15, 0, 10], fov: 30 }}
        className="w-full h-screen"
      >
        <Suspense fallback={<Loader />}>
          <color attach="background" args={[selectedBg?.color || "#FFFFF"]} />
          <ambientLight
            intensity={0.0}
            color={selectedBg?.color || "#FFFFFF"}
          />
          <directionalLight
            position={[0, 0, 0]}
            intensity={0.05}
            color={selectedBg?.color || "#FFFDE0"}
            castShadow
          />

          <ModelView model={selectedModel} />

          <OrbitControls
            autoRotate={selectedModel.autoRotate}
            autoRotateSpeed={selectedModel.RotationSpeed || 0.5}
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
