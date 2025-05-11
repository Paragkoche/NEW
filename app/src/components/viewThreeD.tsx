// @typescript-eslint/no-unused-vars
"use client";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import {
  useGLTF,
  Stage,
  OrbitControls,
  Environment,
  useEnvironment,
  useProgress,
  Html,
  Text,
  RandomizedLight,
  AccumulativeShadows,
} from "@react-three/drei";
import { v4 as uuidv4 } from "uuid";
import * as THREE from "three";
import { useConfig } from "@/context/configure-ctx";
import { Fabric, Mash, Model as ModelType, Product } from "@/types/type";
import { Suspense, useEffect, useRef, useState } from "react";
import Dimension from "./Dimension";
import { getModelById } from "@/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;
const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `/${url}`;

  useEffect(() => {
    useGLTF.clear(fullUrl);
  }, [fullUrl]);

  const { scene } = useGLTF(fullUrl);

  return <primitive key={fullUrl} object={scene} dispose={null} />;
};

const DefaultMesh = ({ node, fabric }: { node: any; fabric?: Fabric }) => {
  const [material, setMaterial] = useState(() => node.material.clone());

  useEffect(() => {
    const cloned = node.material.clone();
    if (fabric?.url) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      loader.load(`${API_BASE_URL}${fabric.url}`, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(fabric.size || 1, fabric.size || 1);
        cloned.map = texture;
        cloned.needsUpdate = true;
        setMaterial(cloned);
      });
    } else {
      cloned.map = null;
      cloned.needsUpdate = true;
      setMaterial(cloned);
    }
  }, [fabric]);

  return (
    <mesh
      key={uuidv4()}
      castShadow
      // receiveShadow
      geometry={node.geometry}
      material={material}
      position={node.position}
      rotation={node.rotation}
      receiveShadow
    ></mesh>
  );
};

const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: Mash[] }) => {
  const baseUrl = glfUrl.startsWith("http")
    ? glfUrl
    : `${API_BASE_URL}${glfUrl}`;
  const { nodes } = useGLTF(baseUrl);
  const { selectedVariants, selectedFabrics } = useConfig();
  console.log("ss", nodes, mashData);

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
            {shouldShowVariant && selectedVariants && selectedVariants.url ? (
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

const ModelView = ({ model }: { model: ModelType }) => {
  const { selectedVariants, selectedFabrics } = useConfig();
  const [rerender, setRerender] = useState(false);

  // useEffect(() => {
  //   // Whenever selectedVariants or selectedFabrics change, trigger a re-render
  //   setRerender((prev) => !prev); // Toggle rerender state
  // }, [selectedVariants, selectedFabrics]);
  console.log("mash.mash", model);

  return (
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
      {/* <AccumulativeShadows
        frames={20} // Number of frames for smoother shadows
        temporal={false} // Temporal anti-aliasing for better smoothness
        color="black"
        opacity={0.5} // Adjust opacity for softer shadows
        scale={10} // Scale of the shadows
      /> */}
      <Suspense fallback={<Loader />}>
        <Model
          glfUrl={`${model.url}`}
          mashData={model.mash}
          key={`${selectedVariants?.url || ""}-${Object.keys(
            selectedFabrics
          ).join(",")}`}
        />
      </Suspense>
    </Stage>
  );
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

    setModel,
    showDimensions,
    canvasRef,
    setPdfText,
  } = useConfig();

  useEffect(() => {
    if (pops) {
      getModelById(pops.id.toString()).then((data) => {
        setModel(data.data);
        changeSelectedModel(data.data.filter((v) => v.isDefault)[0]);
      });

      setPdfText(pops.pdfText);
    }
  }, [pops]);

  return (
    selectedModel && (
      <>
        <Canvas
          ref={canvasRef}
          shadows={selectedModel.shadow ?? true}
          camera={{ position: [-15, 0, 10], fov: 30 }}
          className="w-full h-screen"
          gl={{ preserveDrawingBuffer: true }}
        >
          <Suspense fallback={<Loader />}>
            <color attach="background" args={["#FFFFFF"]} />
            <ambientLight intensity={0.0} color={"#FFFFFF"} />
            <directionalLight
              castShadow
              position={[10, 5, 10]}
              intensity={1}
              color={"#FFFDE0"}
            />

            {/* Model */}

            <ModelView model={selectedModel} />
            {showDimensions &&
              selectedModel.dimensions.map((v, i) => (
                <Dimension
                  start={[v.x, v.y, v.z]}
                  end={[v.end_x, v.end_y, v.end_z]}
                  label={v.label}
                  key={i}
                />
              ))}

            <OrbitControls
              autoRotate={selectedModel.autoRotate}
              autoRotateSpeed={selectedModel.RotationSpeed || 0.5}
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
          </Suspense>
        </Canvas>
      </>
    )
  );
};

export default ViewThreeD;
