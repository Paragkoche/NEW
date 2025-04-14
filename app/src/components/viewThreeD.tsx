"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  EffectComposer,
  ToneMapping,
  Bloom,
} from "@react-three/postprocessing";
import {
  useGLTF,
  Stage,
  OrbitControls,
  Environment,
  useEnvironment,
} from "@react-three/drei";
import * as THREE from "three";
import { useConfig } from "@/context/configure-ctx";
import { Fabric, Mash, Model as ModelType, Product } from "@/types/config";
import { Suspense, useEffect } from "react";
import DefaultView from "./views/defualt";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

// Assuming you have a type for Fabric

const VariantMesh = ({ url }: { url: string }) => {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}/${url}`;
  const { scene } = useGLTF(fullUrl);
  return <primitive object={scene} dispose={null} />;
};

const DefaultMesh = ({ node, fabric }: { node: any; fabric?: Fabric }) => {
  console.log(node.material);

  return (
    <mesh
      key={crypto.randomUUID()}
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

const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: Mash[] }) => {
  const baseUrl = glfUrl.startsWith("http")
    ? glfUrl
    : `${API_BASE_URL}/${glfUrl}`;
  const { scene, nodes } = useGLTF(baseUrl);
  const { selectedVariants, selectedFabric } = useConfig();

  return (
    <group scale={0.05}>
      {mashData.map((mash, index) => {
        const variantUrl = selectedVariants[mash.name];
        const mashKey = mash.name;
        console.log(selectedFabric, ">>><<<<<");

        // Check if the mash has textures enabled
        const fabric =
          mash.textureEnable && selectedFabric
            ? ({
                url: selectedFabric?.url,
                size: selectedFabric.size,
              } as Fabric)
            : undefined;
        console.log(fabric);

        return (
          <Suspense fallback={null} key={mashKey + index}>
            {variantUrl ? (
              <VariantMesh url={variantUrl} />
            ) : (
              nodes[mashKey] && (
                <DefaultMesh node={nodes[mashKey]} fabric={fabric} />
              )
            )}
          </Suspense>
        );
      })}
    </group>
  );
};

// const Model = ({ glfUrl, mashData }: { glfUrl: string; mashData: Mash[] }) => {
//   const baseUrl = glfUrl.startsWith("http")
//     ? glfUrl
//     : `${API_BASE_URL}/${glfUrl}`;
//   const { scene, nodes } = useGLTF(baseUrl);
//   const { selectedVariants } = useConfig();

//   return (
//     <group scale={0.05}>
//       {mashData.map((mash, index) => {
//         const variantUrl = selectedVariants[mash.name];
//         const mashKey = mash.name;

//         return (
//           <Suspense fallback={null} key={mashKey + index}>
//             {variantUrl ? (
//               <VariantMesh url={variantUrl} />
//             ) : (
//               nodes[mashKey] && <DefaultMesh node={nodes[mashKey]} />
//             )}
//           </Suspense>
//         );
//       })}
//     </group>
//   );
// };
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
    <Model glfUrl={`${API_BASE_URL}/${model.url}`} mashData={model.mash} />
  </Stage>
);

const ENV = () => {
  const { Config, envSelect } = useConfig();

  if (envSelect) {
    // Get the HDR URL or use a default sunset HDR URL
    const hdrUrl = envSelect?.url
      ? `${API_BASE_URL}/${envSelect.url}`
      : "https://raw.githubusercontent.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/venice_sunset_1k.hdr";

    // Use the environment from Drei, based on the HDR URL
    const envMap = useEnvironment({ files: hdrUrl });

    return (
      <>
        <Environment background map={envMap} blur={0.7} />

        {/* Apply the blur effect with EffectComposer */}
      </>
    );
  }
  return <Environment background preset="sunset" blur={0.7} />;
};

const ViewThreeD = (pops: Product) => {
  const { model, setConfig, bg, Config, envSelect } = useConfig();
  useEffect(() => {
    setConfig(pops);
  }, [pops]);
  console.log(pops, model);

  return (
    model && (
      <Canvas
        flat
        shadows={model.shadow || true}
        camera={{ position: [-15, 0, 10], fov: 30 }}
      >
        <color attach="background" args={[bg?.color || "#FFFFF"]} />

        <ambientLight intensity={0.0} color={bg?.color || "#FFFFF"} />
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
          minDistance={5} // how close the user can zoom in
          maxDistance={20}
          rotateSpeed={0.5}
          makeDefault
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
        <EffectComposer enableNormalPass={false}>
          <ToneMapping />
        </EffectComposer>
        {Config?.Env && envSelect && envSelect.url ? (
          <Environment
            background
            files={`${API_BASE_URL}/${envSelect.url}`}
            blur={0.8}
          />
        ) : (
          <Environment background preset="sunset" blur={0.8} />
        )}
        {/* <ENV /> */}
      </Canvas>
    )
  );
  // return <DefaultView />;
};

export default ViewThreeD;
