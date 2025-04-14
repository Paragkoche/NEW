import { Model as ModelType } from "@/types/config";
import { Stage, useGLTF } from "@react-three/drei";
import Mash from "./Mash";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const Model = (props: { model: ModelType }) => {
  const baseUrl =
    props.model.url?.startsWith("http") && props.model
      ? `${API_BASE_URL}/${props.model.url}`
      : "";
  const { scene, nodes } = useGLTF(baseUrl);
  console.log(props, "-->");

  return (
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
      <group scale={0.05}>
        {props.model.mash.map((mash, i) => (
          <Mash mash={mash} node={nodes[mash.name]} key={i} />
        ))}
      </group>
    </Stage>
  );
};

export default Model;
