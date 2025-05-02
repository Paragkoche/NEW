import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { useMemo } from "react";

type DimensionProps = {
  start: [number, number, number];
  end: [number, number, number];
  label?: string;
  rotation?: [number, number, number];
};

const Dimension = ({
  start,
  end,
  label,
  rotation = [0, 0, 0],
}: DimensionProps) => {
  const midPoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ];

  const distance = Math.sqrt(
    (end[0] - start[0]) ** 2 +
      (end[1] - start[1]) ** 2 +
      (end[2] - start[2]) ** 2
  ).toFixed(2);

  const direction = useMemo(() => {
    const dir = new THREE.Vector3()
      .subVectors(new THREE.Vector3(...end), new THREE.Vector3(...start))
      .normalize();
    return dir;
  }, [start, end]);

  const length = 0.2; // Arrow length
  const headLength = 0.1;
  const headWidth = 0.05;
  const color = new THREE.Color("rgba(137, 137, 137,0.5)");

  return (
    <>
      <Line
        points={[start, end]}
        color="rgba(137, 137, 137,0.5)"
        lineWidth={1.5}
      />

      {/* Arrow at start */}
      <arrowHelper
        args={[
          direction.clone().negate(), // Reverse direction
          new THREE.Vector3(...start),
          length,
          color,
          headLength,
          headWidth,
        ]}
      />

      {/* Arrow at end */}
      <arrowHelper
        args={[
          direction,
          new THREE.Vector3(...end),
          length,
          color,
          headLength,
          headWidth,
        ]}
      />

      <group position={midPoint} rotation={rotation}>
        <Html center>
          <div
            style={{
              color: "black",
              background: "white",
              padding: "2px 4px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {label ?? `${distance}m`}
          </div>
        </Html>
      </group>
    </>
  );
};

export default Dimension;
