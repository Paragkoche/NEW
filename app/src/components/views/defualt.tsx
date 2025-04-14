import { useCostumes } from "@/context/Costamize-ctx";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import Model from "./Model";

const DefaultView = () => {
  const { selectModel } = useCostumes();
  console.log(selectModel);

  return (
    selectModel && (
      <Canvas
        flat
        shadows={selectModel?.shadow}
        camera={{ position: [-15, 0, 10], fov: 30 }}
      >
        <Model model={selectModel} />
        <OrbitControls
          autoRotate={selectModel.autoRotate}
          autoRotateSpeed={selectModel.RotationSpeed || 0.5}
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
      </Canvas>
    )
  );
};

export default DefaultView;
