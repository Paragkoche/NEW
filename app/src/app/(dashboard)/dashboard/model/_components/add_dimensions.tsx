import { forwardRef, Ref, Suspense, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Dimensions } from "@/types/type";
import Dimension from "@/components/Dimension";
import { z } from "zod";
import { useWatch, useFormContext } from "react-hook-form";
import { EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { FormDataType } from "./form";

const dimensionSchema = z.object({
  label: z.string().min(1),
  x: z.coerce.number(),
  y: z.coerce.number(),
  z: z.coerce.number(),
  end_x: z.coerce.number(),
  end_y: z.coerce.number(),
  end_z: z.coerce.number(),
});
function Model({ glbUrl }: { glbUrl: string }) {
  const { scene } = useGLTF(glbUrl);
  return <primitive object={scene} scale={0.05} />;
}

export function ModelViewer({
  modelUrl,
  dimension,
}: {
  modelUrl: string;
  dimension: z.infer<typeof dimensionSchema>[];
}) {
  return (
    <Canvas camera={{ position: [-15, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.0} />
      <Suspense fallback={null}>
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
          <Model glbUrl={modelUrl} />
        </Stage>
        {dimension.map((dim, index) => (
          <Dimension
            key={index}
            start={[dim.x, dim.y, dim.z]}
            end={[dim.end_x, dim.end_y, dim.end_z]}
            label={dim.label}
          />
        ))}
      </Suspense>
      <OrbitControls
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
    </Canvas>
  );
}

const AddDimensions = forwardRef(
  (
    props: {
      modelUrl: File | null;
      fields: any[];

      remove: any;
      append: any;
    },
    ref: Ref<HTMLDialogElement>
  ) => {
    const { control, register, getValues, setValue, watch } =
      useFormContext<FormDataType>();

    const watchedDimensions = useWatch({
      control,
      name: "dimensions", // field name in your form
    });
    const url = props.modelUrl ? URL.createObjectURL(props.modelUrl) : "";

    if (!props.modelUrl) return null;

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() =>
                (ref as React.RefObject<HTMLDialogElement>)?.current?.close()
              }
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Add Dimensions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="h-[50vh] border rounded-md">
              <ModelViewer dimension={watchedDimensions || []} modelUrl={url} />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
              <h4 className="font-semibold">Dimensions</h4>
              {props.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="min-w-[320px] snap-center flex-shrink-0 border p-4 rounded-md bg-base-200 space-y-2"
                >
                  <input
                    placeholder="Label"
                    className="input input-bordered w-full"
                    {...register(`dimensions.${index}.label`)}
                  />

                  {["x", "y", "z", "end_x", "end_y", "end_z"].map(
                    (axis: string) => (
                      <div key={axis}>
                        <label className="label">
                          <span className="label-text">
                            {axis.toUpperCase()}:{" "}
                          </span>
                          <span className="text-xs text-gray-500">
                            {watch(
                              `dimensions.${index}.${
                                axis as
                                  | "x"
                                  | "y"
                                  | "z"
                                  | "end_x"
                                  | "end_y"
                                  | "end_z"
                              }`
                            ) ?? 50}
                          </span>
                        </label>
                        <input
                          type="range"
                          min={-5}
                          max={5}
                          step={0.1}
                          className="range range-sm"
                          defaultValue={
                            getValues(
                              `dimensions.${index}.${
                                axis as
                                  | "x"
                                  | "y"
                                  | "z"
                                  | "end_x"
                                  | "end_y"
                                  | "end_z"
                              }`
                            ) || 0
                          }
                          onChange={(e) =>
                            setValue(
                              `dimensions.${index}.${
                                axis as
                                  | "x"
                                  | "y"
                                  | "z"
                                  | "end_x"
                                  | "end_y"
                                  | "end_z"
                              }`,
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    className="btn btn-error btn-sm w-full"
                    onClick={() => props.remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() =>
                  props.append({
                    label: "",
                    x: 0,
                    y: 0,
                    z: 0,
                    end_x: 0,
                    end_y: 0,
                    end_z: 0,
                  })
                }
              >
                Add Dimension
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

export default AddDimensions;
