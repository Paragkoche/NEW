import * as THREE from "three";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  modelUploadState,
  Mash,
  Variants as VariantsType,
} from "@/types/upload";
import { addFabric, addVariant } from "@/api";
import { getFileExtension } from "@/utility/ext";

type MeshViewerProps = {
  mesh: THREE.Object3D;
  texture?: THREE.Texture;
};

const applyTexture = (mesh: THREE.Object3D, texture: THREE.Texture) => {
  mesh.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.map = texture;
      mat.needsUpdate = true;
    }
  });
};

const MeshViewer = ({ mesh, texture }: MeshViewerProps) => {
  useEffect(() => {
    if (mesh && texture) {
      applyTexture(mesh, texture);
    }
  }, [mesh, texture]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#FFFF"]} />

      <ambientLight intensity={0.5} color="#FFFF" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        color="#FFFF"
        castShadow
      />
      <primitive object={mesh} scale={[0.5, 0.5, 0.5]} />
      <OrbitControls />
    </Canvas>
  );
};

const Fabrics = (props: {
  name: string;
  setFabrics?: Dispatch<SetStateAction<Mash>>;
  setFF?: Dispatch<
    SetStateAction<
      {
        file: ArrayBuffer;
        thumbnail: ArrayBuffer;
        name: string;
        size: number;
      }[]
    >
  >;
}) => {
  const [fabrics, setFabrics] = useState<
    {
      file: ArrayBuffer;
      thumbnail: ArrayBuffer;
      name: string;
      size: number;
      id?: number;
    }[]
  >([]);
  useEffect(() => {
    if (props.setFabrics) props.setFabrics((v) => ({ ...v, fabrics }));
    else if (props.setFF) props.setFF((v) => [...v, ...fabrics]);
  }, [fabrics]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<{
    file: ArrayBuffer | null;
    thumbnail: ArrayBuffer | null;
    name: string;
    size: number;
  }>({ file: null, thumbnail: null, name: "", size: 20 });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    thumbnail?: string;
    file?: string;
    size?: string;
  }>({});

  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    if (index !== null) {
      const fabric = fabrics[index];
      setDraft({ ...fabric });
    } else {
      setDraft({ file: null, thumbnail: null, name: "", size: 20 });
    }
    setFormErrors({});
    const modal = document.getElementById(
      `my_modal_fabrics_${props.name}`
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "file" | "thumbnail"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const buffer = await e.target.files[0].arrayBuffer();
    setDraft((prev) => ({ ...prev, [type]: buffer }));
    setFormErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, name: e.target.value }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, size: Number(e.target.value) }));
    setFormErrors((prev) => ({ ...prev, size: undefined }));
  };
  const handleSave = async () => {
    const errors: typeof formErrors = {};
    if (!draft.name) errors.name = "Name is required";
    if (!draft.thumbnail) errors.thumbnail = "Thumbnail is required";
    if (!draft.file) errors.file = "Fabric file is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFabrics((prev) => {
      const updated = [...prev];
      if (editingIndex !== null && editingIndex < updated.length) {
        updated[editingIndex] = { ...draft } as any;
      } else {
        updated.push(draft as any);
      }
      return updated;
    });

    setEditingIndex(null);
    setFormErrors({});

    const modal = document.getElementById(
      `my_modal_fabrics_${props.name}`
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleRemove = (index: number) => {
    setFabrics((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  console.log(fabrics);

  const onSubmit = async () => {
    const uploadFile = async (
      url: string,
      file: ArrayBuffer,
      fileName: string,
      fieldName: string
    ) => {
      const formData = new FormData();
      formData.append(fieldName, new File([file], fileName));
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Failed to upload file: ${fileName}`);
        }
        console.log(`${fileName} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading file ${fileName}:`, error);
      }
    };

    if (fabrics.length === 0) {
      console.warn("No fabrics to upload.");
      return;
    }

    await Promise.all(
      fabrics.map(async (fabric, i) => {
        try {
          if (!fabric.id) {
            const { data, config } = await addFabric(
              {
                name: fabric.name,
                size: fabric.size,
              },
              ""
            );

            setFabrics((fab) => {
              const updated = [...fab];
              updated[i] = { ...fabric, id: data.data.id } as any;
              return updated;
            });

            if (fabric.thumbnail) {
              const ext = await getFileExtension(fabric.thumbnail);
              await uploadFile(
                `${config.baseURL}/model/fabric-upload/thumbnail/${data.data.id}`,
                fabric.thumbnail,
                `fabric_thumbnail_${fabric.name}.${ext}`,
                "fabric-thumbnail"
              );
            }

            if (fabric.file) {
              const ext = await getFileExtension(fabric.file);
              await uploadFile(
                `${config.baseURL}/model/fabric-upload/${data.data.id}`,
                fabric.file,
                `fabric__${fabric.name}.${ext}`,
                "fabric"
              );
            }
          }
        } catch (error) {
          console.error("Error processing fabric:", error);
        }
      })
    );
  };
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {fabrics.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-[16px] h-[16px]">
              <img src={URL.createObjectURL(new Blob([v.thumbnail]))} />
            </div>
            <button
              className="btn btn-square btn-outline"
              onClick={() => handleRemove(i)}
            >
              <Trash2 size={16} />
            </button>
            <button
              className="btn btn-square btn-outline"
              onClick={() => openModal(i)}
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
        {fabrics.length != 0 && (
          <div>
            <button
              className="btn"
              onClick={onSubmit}
              disabled={fabrics.some((v) => v.id !== undefined)}
            >
              Upload all
            </button>
          </div>
        )}
      </div>

      <button className="btn" onClick={() => openModal(null)}>
        Add fabric
      </button>

      <dialog id={`my_modal_fabrics_${props.name}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <fieldset className="fieldset space-y-2">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              className="input"
              value={draft.name}
              onChange={handleNameChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}

            <legend className="fieldset-legend">Thumbnail</legend>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "thumbnail")}
            />
            {formErrors.thumbnail && (
              <p className="text-red-500 text-sm">{formErrors.thumbnail}</p>
            )}

            <legend className="fieldset-legend">Fabric File</legend>
            <input
              type="file"
              className="file-input"
              multiple={false}
              accept="image/*"
              onChange={(e) => handleFileChange(e, "file")}
            />
            {formErrors.file && (
              <p className="text-red-500 text-sm">{formErrors.file}</p>
            )}

            <legend className="fieldset-legend">Size</legend>
            <input
              type="text"
              className="input"
              value={draft.size}
              onChange={handleSizeChange}
            />
            {formErrors.size && (
              <p className="text-red-500 text-sm">{formErrors.size}</p>
            )}
          </fieldset>

          <button className="btn mt-4 w-full" onClick={handleSave}>
            Save
          </button>
        </div>
      </dialog>
    </div>
  );
};

const Variants = (props: {
  name: string;
  mashName: string;
  setVariants: Dispatch<SetStateAction<Mash>>;
}) => {
  const [variants, setVariants] = useState<Mash["variants"]>([]);

  const [fabrics, setFabrics] = useState<
    {
      file: ArrayBuffer;
      thumbnail: ArrayBuffer;
      name: string;
      size: number;
      id?: number;
    }[]
  >([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentVariant, setCurrentVariant] = useState<VariantsType>({
    file: null,
    thumbnail: null,
    name: "",
    itOptional: false,
    textureEnable: false,
  });

  const [formErrors, setFormErrors] = useState<{
    file?: string;
    thumbnail?: string;
    name?: string;
  }>({});

  useEffect(() => {
    console.log(fabrics, variants);

    props.setVariants((v) => ({ ...v, variants }));
  }, [variants]);
  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    if (index !== null) {
      const variant = variants[index];
      setCurrentVariant({ ...variant });
    } else {
      setCurrentVariant({
        file: null,
        thumbnail: null,
        name: "",
        itOptional: false,
        textureEnable: false,
      });
    }
    setFormErrors({});
    const modal = document.getElementById(
      `my_modal_Variants_${props.name}`
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "file" | "thumbnail"
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const buffer = await e.target.files[0].arrayBuffer();
    setCurrentVariant((prev) => ({ ...prev, [type]: buffer }));
    setFormErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentVariant((prev) => ({ ...prev, name: e.target.value }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleSave = () => {
    const errors: typeof formErrors = {};
    if (!currentVariant.name.trim()) errors.name = "Name is required.";
    if (!currentVariant.thumbnail) errors.thumbnail = "Thumbnail is required.";
    if (!currentVariant.file) errors.file = "Fabric file is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const newVariant: VariantsType = {
      name: currentVariant.name,
      file: currentVariant.file as ArrayBuffer,
      thumbnail: currentVariant.thumbnail as ArrayBuffer,
      fabrics: fabrics.length > 0 ? fabrics : undefined,
      itOptional: currentVariant.itOptional,
      textureEnable: currentVariant.textureEnable,
    };

    setVariants((prev) => {
      const updated = [...prev];
      if (editingIndex !== null && editingIndex < updated.length) {
        updated[editingIndex] = newVariant;
      } else {
        updated.push(newVariant);
      }
      return updated;
    });

    setEditingIndex(null);
    const modal = document.getElementById(
      `my_modal_Variants_${props.name}`
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  const handleRemove = (index: number) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  const onSubmit = async () => {
    const uploadFile = async (
      url: string,
      file: ArrayBuffer,
      fileName: string,
      fieldName: string
    ) => {
      const formData = new FormData();
      formData.append(fieldName, new File([file], fileName));
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error(`Failed to upload file: ${fileName}`);
        }
        console.log(`${fileName} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading file ${fileName}:`, error);
      }
    };

    if (variants.length === 0) {
      console.warn("No fabrics to upload.");
      return;
    }

    await Promise.all(
      variants.map(async (fabric, i) => {
        try {
          if (!fabric.id) {
            const { data, config } = await addVariant(
              {
                itOptional: fabric.itOptional,
                textureEnable: fabric.textureEnable,
                name: fabric.name != "" ? fabric.name : props.mashName,
              },
              ""
            );

            setVariants((fab) => {
              const updated = [...fab];
              updated[i] = { ...fabric, id: data.data.id } as any;
              return updated;
            });

            if (fabric.thumbnail) {
              const ext = await getFileExtension(fabric.thumbnail);
              await uploadFile(
                `${config.baseURL}/model/variants-upload/thumbnail/${data.data.id}`,
                fabric.thumbnail,
                `variant_thumbnail_${fabric.name}.${ext}`,
                "variant-thumbnail"
              );
            }

            if (fabric.file) {
              const ext = await getFileExtension(fabric.file);
              await uploadFile(
                `${config.baseURL}/model/variants-upload/${data.data.id}`,
                fabric.file,
                `variant__${fabric.name}.${ext}`,
                "variant"
              );
            }
          }
        } catch (error) {
          console.error("Error processing fabric:", error);
        }
      })
    );
  };
  console.log("ss", variants);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-[16px] h-[16px]">
              <img
                src={
                  v.thumbnail
                    ? URL.createObjectURL(new Blob([v.thumbnail]))
                    : ""
                }
                alt="Thumbnail"
              />
            </div>
            <button
              className="btn btn-square btn-outline"
              onClick={() => handleRemove(i)}
            >
              <Trash2 size={16} />
            </button>
            <button
              className="btn btn-square btn-outline"
              onClick={() => openModal(i)}
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
        {variants.length != 0 && (
          <div>
            <button
              className="btn"
              onClick={onSubmit}
              disabled={variants.every((v) => v.id !== undefined)}
            >
              Upload all
            </button>
          </div>
        )}
      </div>

      <button className="btn" onClick={() => openModal(null)}>
        Add Variant
      </button>

      <dialog id={`my_modal_Variants_${props.name}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <fieldset className="fieldset space-y-2">
            <legend className="fieldset-legend">Name</legend>
            <input
              type="text"
              className="input"
              value={currentVariant.name}
              onChange={handleNameChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}

            <legend className="fieldset-legend">Thumbnail</legend>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "thumbnail")}
            />
            {formErrors.thumbnail && (
              <p className="text-red-500 text-sm">{formErrors.thumbnail}</p>
            )}

            <legend className="fieldset-legend">Variant File</legend>
            <input
              type="file"
              className="file-input"
              accept=".glb"
              onChange={(e) => handleFileChange(e, "file")}
            />
            {formErrors.file && (
              <p className="text-red-500 text-sm">{formErrors.file}</p>
            )}
            {currentVariant.textureEnable && (
              <Fabrics name={props.name} setFF={setFabrics} />
            )}
          </fieldset>
          <div className=" flex  gap-3.5">
            <label className="fieldset-label">
              <input
                type="checkbox"
                checked={currentVariant.itOptional}
                className="toggle"
                onChange={(e) => {
                  setCurrentVariant((prev) => ({
                    ...prev,
                    itOptional: e.target.checked,
                  }));
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              It Optional
            </label>
            <label className="fieldset-label">
              <input
                type="checkbox"
                checked={currentVariant.textureEnable}
                className="toggle"
                onChange={(e) => {
                  setCurrentVariant((prev) => ({
                    ...prev,
                    textureEnable: e.target.checked,
                  }));
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
              texture Enable
            </label>
          </div>

          <button className="btn mt-4 w-full" onClick={handleSave}>
            Save
          </button>
        </div>
      </dialog>
    </div>
  );
};

const MeshEdited = ({
  name,

  defaultMesh,
  setData: setData_,
}: {
  name: string;

  defaultMesh: THREE.Object3D;
  setData: (data: Mash) => void;
}) => {
  const [data, setData] = useState<Mash>({
    name: "",
    fabrics: [],
    itOptional: false,
    textureEnable: false,
    variants: [],
  });

  return (
    <div className="flex items-start gap-6">
      {/* Viewer */}
      <div className="">
        <p className="font-bold mb-2">{name}</p>
        <MeshViewer mesh={defaultMesh} texture={undefined} />
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Fabrics */}
        <div>
          <Fabrics name={crypto.randomUUID()} setFabrics={setData} />

          <Variants
            name={crypto.randomUUID()}
            mashName={name}
            setVariants={setData}
          />
        </div>
        <div className=" flex  gap-3.5">
          <label className="fieldset-label">
            <input
              type="checkbox"
              checked={data.itOptional}
              className="toggle"
              onChange={(e) =>
                setData((prv) => ({ ...prv, itOptional: e.target.checked }))
              }
            />
            It Optional
          </label>
          <label className="fieldset-label">
            <input
              type="checkbox"
              checked={data.textureEnable}
              className="toggle"
              onChange={(e) =>
                setData((prv) => ({ ...prv, textureEnable: e.target.checked }))
              }
            />
            texture Enable
          </label>
        </div>
        <div className="w-full">
          <button
            className="btn w-full"
            disabled={data.id !== undefined}
            onClick={async () => {
              console.log(name);

              const { data: a, config } = await addVariant(
                {
                  itOptional: data.itOptional,
                  textureEnable: data.textureEnable,
                  name,
                },
                ""
              );
              setData({ ...data, id: a.data.id });
              setData_({ ...data, name, id: a.data.id });
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeshEdited;
