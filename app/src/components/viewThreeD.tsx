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
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Dimension from "./Dimension";
import { addProductViewCount, getModelById } from "@/api";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const getExt = (url: string) =>
  url.match(/\.([^.?#]+)(\?|#|$)/i)?.[1].toLowerCase();

function useDynamicScene(url: string) {
  const ext = useMemo(() => getExt(url), [url]);

  // choose the right loader
  const gltf = ext && (ext === "glb" || ext === "gltf") ? useGLTF(url) : null;
  const objGrp = ext === "obj" ? useLoader(OBJLoader, url) : null;

  // handy “nodes” map so Model keeps working the same way
  const nodes = useMemo(() => {
    if (gltf) return gltf.nodes; // GLTF already gives us nodes
    if (!objGrp) return {};
    const m: Record<string, THREE.Mesh> = {};
    objGrp.traverse((c) => {
      if (c instanceof THREE.Mesh) m[c.name] = c;
    });
    return m; // OBJ → build a name→mesh index
  }, [gltf, objGrp]);

  return { scene: gltf?.scene ?? objGrp, nodes };
}

const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `/${url}`;

  useEffect(() => {
    useGLTF.clear(fullUrl);
  }, [fullUrl]);

  const { scene } = useDynamicScene(fullUrl);

  return <primitive key={fullUrl} object={scene!} dispose={null} />;
};

export const DefaultMesh = ({
  node,
  fabric,
}: {
  node: THREE.Mesh | any;
  fabric?: Fabric;
}) => {
  const [material, setMaterial] = useState<THREE.Material>(() => {
    if (node.material && typeof node.material.clone === "function") {
      return node.material.clone();
    }
    // Fallback material if OBJ has no material or clone fails
    return new THREE.MeshStandardMaterial();
  });

  useEffect(() => {
    const baseMat =
      node.material && typeof node.material.clone === "function"
        ? node.material.clone()
        : new THREE.MeshStandardMaterial();

    if (fabric?.url) {
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      loader.load(`${API_BASE_URL}${fabric.url}`, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(fabric.size || 1, fabric.size || 1);
        baseMat.map = texture;
        baseMat.needsUpdate = true;
        setMaterial(baseMat);
      });
    } else {
      setMaterial(baseMat);
    }
  }, [fabric, node.material]);

  return (
    <mesh
      key={uuidv4()}
      castShadow
      geometry={node.geometry}
      material={material}
      position={node.position}
      rotation={node.rotation}
      receiveShadow
    />
  );
};
const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: Mash[] }) => {
  const baseUrl = glfUrl.startsWith("http")
    ? glfUrl
    : `${API_BASE_URL}${glfUrl}`;
  const { nodes } = useDynamicScene(baseUrl);
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
              <VariantMesh url={`${API_BASE_URL}${selectedVariants.url}`} />
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

  return (
    <Stage
      intensity={0.3} // soft light
      environment="forest"
      adjustCamera={false}
      shadows={{
        type: "accumulative",
        bias: -0.05, // Slight bias to control sharpness of shadows
        intensity: Math.PI, // Adjust intensity to simulate accumulation
        temporal: false, // abe bhai 3 month lega debug kar ne ko fuck!!
      }}
      castShadow
    >
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
    rotation,
    setModel,
    showDimensions,
    canvasRef,
    setPdfText,
    Models,
    setImageBank,
    SetRotation,
  } = useConfig();

  useEffect(() => {
    if (pops) {
      getModelById(pops.id.toString()).then((data) => {
        setModel(data.data);
        changeSelectedModel(data.data.filter((v) => v.isDefault)[0]);
      });
    }
  }, [pops]);
  useEffect(() => {
    setPdfText(pops.pdfText);
    setImageBank(`${API_BASE_URL}${selectedModel?.imageBank}`!);
    SetRotation(selectedModel?.autoRotate ?? false);
  }, [selectedModel]);

  useEffect(() => {
    if (selectedModel) {
      const local = localStorage.getItem(selectedModel.name);

      if (!local) {
        const currentDate = new Date();
        addProductViewCount(selectedModel.id).then(() => {
          localStorage.setItem(
            selectedModel.name,
            JSON.stringify({
              date: currentDate,
            })
          );
        });
      } else {
        const localData = JSON.parse(local);
        const localDate = new Date(localData.date);
        const currentDate = new Date();
        if (
          localDate.getFullYear() !== currentDate.getFullYear() ||
          localDate.getMonth() !== currentDate.getMonth() ||
          localDate.getDate() !== currentDate.getDate()
        ) {
          // Dates are different, send API call
          addProductViewCount(selectedModel.id).then(() => {
            localStorage.setItem(
              selectedModel.name,
              JSON.stringify({
                date: currentDate,
              })
            );
          });
        }
      }
    }
  }, [selectedModel]);

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
            <ambientLight intensity={0.05} color={"#000"} />
            <directionalLight
              castShadow
              position={[10, 5, 10]}
              intensity={0.005}
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
              autoRotate={rotation ?? false}
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
