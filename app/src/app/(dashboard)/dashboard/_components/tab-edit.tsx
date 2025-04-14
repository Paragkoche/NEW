import { useGLTFFromArrayBuffer } from "@/hook/glb-node";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ColorPiker from "../_components/color-piker";
import MeshEdited from "../_components/mesh-editer";
import EnvEdited from "../_components/env";
import { modelUploadState } from "@/types/upload";
import { X } from "lucide-react";
import { addModel, connectModel } from "@/api";

const TabEdit = (props: {
  data: ArrayBuffer;
  keys: string;
  fileName: string;
  removeFile: () => void;
  productId: number;
  setModel: Dispatch<SetStateAction<modelUploadState>>;
}) => {
  console.log(props);

  const [tabName, setTabName] = useState<string | null>(null);
  const [modelSetting, setModelSetting] = useState<modelUploadState>({
    autoRotate: false,
    modelName: "",
    rotationSpeed: 0,
    shadow: false,
    bgs: [],
    env: [],
    isDefault: false,
    mash: [],
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const handleThumbnailFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);

    if (!e.target.files) return;
    setThumbnail(e.target.files[0]);
  };

  const glf = useGLTFFromArrayBuffer(props.data);

  console.log(glf);
  useEffect(() => {
    props.setModel(modelSetting);
  }, [modelSetting]);
  return (
    <>
      <input
        type="radio"
        name={`my_tabs`}
        className="tab"
        aria-label={`Model ${tabName || props.keys}`}
      />

      <div className="tab-content bg-base-100 border-base-300 p-6">
        <h1 className="h1-l my-2.5 flex items-center gap-3">
          {props.fileName}

          <X className="cursor-pointer" onClick={props.removeFile} />
        </h1>
        <div className="flex flex-col gap-y-2.5">
          <div className="collapse collapse-plus bg-base-100 border border-base-300">
            <input
              type="radio"
              name="my-accordion-3"
              disabled={modelSetting.productId !== undefined}
            />
            <div className="collapse-title font-semibold">
              Add Product settings
            </div>
            <div className="collapse-content text-sm">
              <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Model setting</legend>
                <label className="fieldset-label">Model name</label>
                <input
                  type="text"
                  className="input join-item"
                  placeholder="Model name"
                  value={tabName || ""}
                  onChange={(e) => {
                    setTabName(e.target.value);
                    setModelSetting((prv) => ({
                      ...prv,
                      modelName: e.target.value,
                    }));
                  }}
                />
                <label className="fieldset-label">shadow</label>
                <input
                  type="checkbox"
                  checked={modelSetting?.shadow || false}
                  onChange={(e) =>
                    setModelSetting((prv) => ({
                      ...prv,
                      shadow: e.target.checked,
                    }))
                  }
                  className="toggle"
                />
                <label className="fieldset-label">is First view?</label>
                <input
                  type="checkbox"
                  checked={modelSetting?.isDefault || false}
                  onChange={(e) =>
                    setModelSetting((prv) => ({
                      ...prv,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="toggle"
                />
                <label className="fieldset-label">auto rotate</label>
                <input
                  type="checkbox"
                  checked={modelSetting?.autoRotate || false}
                  onChange={(e) =>
                    setModelSetting((prv) => ({
                      ...prv,
                      autoRotate: e.target.checked,
                    }))
                  }
                  className="toggle"
                />

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Thumbnail</legend>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="file-input file-input-ghost"
                    placeholder="s"
                    onChange={handleThumbnailFileChange}
                  />
                </fieldset>

                {modelSetting?.autoRotate && (
                  <>
                    <label className="fieldset-label">Rotation speed</label>
                    <div className="w-full max-w-xs">
                      <input
                        onChange={(e) =>
                          setModelSetting((prv) => ({
                            ...prv,
                            rotationSpeed: Number(e.target.value),
                          }))
                        }
                        type="range"
                        min={0}
                        max="1"
                        value={modelSetting.rotationSpeed}
                        className="range"
                        step="0.25"
                      />
                      <div className="flex justify-between px-2.5 mt-2 text-xs">
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                      </div>
                      <div className="flex justify-between px-2.5 mt-2 text-xs">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  </>
                )}

                <button
                  className="btn btn-lg btn-accent"
                  onClick={() => {
                    addModel(
                      {
                        name: modelSetting.modelName,
                        isDefault: modelSetting.isDefault,
                        autoRotate: modelSetting.autoRotate,
                        RotationSpeed: modelSetting.rotationSpeed,
                        productId: props.productId,
                        shadow: modelSetting.shadow,
                      },
                      ""
                    )
                      .then(({ data, config }) => {
                        console.log("data:", data);
                        setModelSetting((prv) => ({
                          ...prv,
                          productId: data.data.id,
                        }));
                        if (thumbnail) {
                          const formData = new FormData();
                          formData.append("thumbnail", thumbnail);
                          fetch(
                            config.baseURL +
                              "/model/upload-model-thumbnail/" +
                              data.data.id,
                            {
                              method: "POST",
                              body: formData,
                            }
                          )
                            .then((response) => {
                              if (response.ok) {
                                console.log("thumbnail uploaded successfully");
                              } else {
                                console.error("Failed to upload model");
                              }
                            })
                            .catch((error) => {
                              console.error("Error uploading model:", error);
                            });
                        }
                        if (props.data) {
                          const formData = new FormData();
                          formData.append(
                            "model",
                            new File([props.data], props.fileName)
                          );
                          fetch(
                            config.baseURL +
                              "/model/upload-model/" +
                              data.data.id,
                            {
                              method: "POST",
                              body: formData,
                            }
                          )
                            .then((response) => {
                              if (response.ok) {
                                console.log("model uploaded successfully");
                              } else {
                                console.error("Failed to upload model");
                              }
                            })
                            .catch((error) => {
                              console.error("Error uploading model:", error);
                            });
                        }
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  }}
                >
                  {" "}
                  Submit{" "}
                </button>
              </fieldset>
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 border border-base-300">
            <input type="radio" name="my-accordion-3" />
            <div className="collapse-title font-semibold">
              Add Mash Varments and Fabrics
            </div>
            <div className="collapse-content text-sm">
              <fieldset className="fieldset w-full bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Mash and fabric</legend>
                {glf &&
                  Object.keys(glf.meshes).map((v, i) => (
                    <MeshEdited
                      name={v}
                      defaultMesh={glf.meshes[v]}
                      key={i}
                      setData={(data) => {
                        setModelSetting((v) => ({
                          ...v,
                          mash: [
                            ...v.mash.filter((mesh) => mesh.name !== data.name),
                            data,
                          ],
                        }));
                      }}
                    />
                  ))}
              </fieldset>
            </div>
          </div>
          <div>
            <button
              className="btn btn-accent"
              onClick={() => {
                if (modelSetting.productId)
                  connectModel(
                    {
                      modelId: modelSetting.productId,
                      productId: props.productId, // Add the missing productId
                      mash: modelSetting.mash
                        .filter((mash) => mash.id !== undefined) // Ensure id is defined
                        .map((mash) => ({
                          id: mash.id as number, // Explicitly cast id to number
                          fabrics: mash.fabrics
                            .filter((v) => v.id !== undefined) // Filter out undefined ids
                            .map((v) => ({ id: v.id as number })), // Explicitly cast id to number
                          variant: mash.variants
                            .filter((v) => v.id !== undefined) // Filter out undefined ids
                            .map((v) => ({ id: v.id as number })), // Explicitly cast id to number
                        })),
                    },
                    ""
                  );
              }}
            >
              Upload model
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabEdit;
