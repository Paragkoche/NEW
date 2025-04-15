import { useCostumes } from "@/context/Costamize-ctx";
import { Mash as MashPropType } from "@/types/config";
import { v4 as uuidv4 } from "uuid";
const Mash = (props: { mash: MashPropType; node: any }) => {
  console.log("--->", props);

  return (
    <mesh
      key={uuidv4()}
      castShadow
      receiveShadow
      geometry={props.node.geometry}
      material={props.node.material}
      position={props.node.position}
      rotation={props.node.rotation}
      scale={props.node.scale}
    />
  );
};

export default Mash;
