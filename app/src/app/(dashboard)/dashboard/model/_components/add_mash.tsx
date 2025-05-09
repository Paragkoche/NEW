import { FormEventHandler, forwardRef, Ref, useEffect, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import Select from "react-select";
import { useGLTFFromArrayBuffer } from "../_ctx/mash";
import { getAllFabricRage } from "@/api";
import { FabricRage } from "@/types/type";
import { FormDataType } from "./form";
import { toast } from "sonner";

const AddMash = forwardRef(
  (
    props: {
      modelUrl: File | null;
    },
    ref: Ref<HTMLDialogElement>
  ) => {
    const { control, register, setValue, watch } =
      useFormContext<FormDataType>();
    const { fields, append, update } = useFieldArray({
      control,
      name: "mashes",
    });

    const [selectedMesh, setSelectedMesh] = useState<number | null>(null);
    const [enableTexture, setEnableTexture] = useState(false);
    const [fabricRange, setFabricRange] = useState<FabricRage[]>([]);

    const glf = useGLTFFromArrayBuffer(props.modelUrl);
    const meshKeys = glf?.meshes ? Object.keys(glf.meshes) : [];

    useEffect(() => {
      getAllFabricRage().then((data) => setFabricRange(data.data));
    }, []);

    useEffect(() => {
      // Initialize mashes array based on mesh count
      if (meshKeys.length > 0 && fields.length < meshKeys.length) {
        meshKeys.forEach((name) => {
          append({
            name: "",
            mashName: name,
            url: "",
            textureEnable: false,
            itOptional: false,
            thumbnailUrl: undefined,
            fabricRanges: [],
            mashVariant: {
              mash: [],
              name: "",
            },
          });
        });
      }
    }, [meshKeys]);

    if (!props.modelUrl) return null;

    const handleMeshSelect = (index: number) => {
      setSelectedMesh(index);
      const selectedMesh = fields[index];
      setEnableTexture(selectedMesh?.textureEnable ?? false);
    };

    const handleVariantAdd = () => {
      const variantDialog = document.getElementById(
        "variant-dialog"
      ) as HTMLDialogElement;
      variantDialog?.showModal();
    };

    const handleVariantSave = (e: React.FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const variantName = formData.get("variantName") as string;
      const variantDescription = formData.get("variantDescription") as string;
      const variantThumbnail = formData.get("variantThumbnail") as File;

      const currentMesh = fields[selectedMesh as number];

      const updatedVariants = [
        ...(currentMesh.mashVariant?.mash || []),

        {
          name: variantName,
          description: variantDescription,
          thumbnail: variantThumbnail,
        },
      ];

      update(selectedMesh as number, {
        ...currentMesh,
        mashVariant: {
          name: currentMesh.name!, // Ensure name is always a string
          mash: updatedVariants.map((variant) => ({
            ...variant,
            mashName: currentMesh.mashName,
            fabricRanges: currentMesh.fabricRanges,
            url: currentMesh.url,
            itOptional: currentMesh.itOptional,
            textureEnable: currentMesh.textureEnable,
            thumbnailUrl: currentMesh.thumbnailUrl,
          })),
        },
      });

      (document.getElementById("variant-dialog") as HTMLDialogElement)?.close();

      toast.success("Variant added successfully");
    };

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

          <h3 className="font-bold text-lg mb-4">Edit Mesh</h3>

          {meshKeys.length > 0 && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Mesh</label>
              <select
                onChange={(e) => handleMeshSelect(parseInt(e.target.value))}
                className="select select-bordered w-full"
              >
                {meshKeys.map((meshName, i) => (
                  <option key={meshName} value={i}>
                    {meshName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedMesh !== null && fields[selectedMesh] && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 col-span-1">
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register(`mashes.${selectedMesh}.itOptional`)}
                />
                Optional
              </label>

              <label className="flex items-center gap-2 col-span-1">
                <input
                  type="checkbox"
                  className="checkbox"
                  {...register(`mashes.${selectedMesh}.textureEnable`)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setEnableTexture(checked);
                    setValue(`mashes.${selectedMesh}.textureEnable`, checked);
                  }}
                />
                Enable Texture
              </label>

              <label className="col-span-2">
                Name:
                <input
                  type="text"
                  {...register(`mashes.${selectedMesh}.name`)}
                  className="input input-bordered w-full"
                />
              </label>

              <label className="col-span-2">
                Mesh Name:
                <input
                  type="text"
                  {...register(`mashes.${selectedMesh}.mashName`)}
                  className="input input-bordered w-full"
                />
              </label>

              <label className="col-span-2">
                Thumbnail URL:
                <input
                  type="file"
                  {...register(`mashes.${selectedMesh}.thumbnailUrl`)}
                  className="file-input input-bordered w-full"
                />
              </label>

              <label className="col-span-2">
                Model URL:
                <input
                  type="text"
                  {...register(`mashes.${selectedMesh}.url`)}
                  className="input input-bordered w-full"
                />
              </label>

              {enableTexture && (
                <label className="col-span-2">
                  Select Fabrics:
                  <Controller
                    name={`mashes.${selectedMesh}.fabricRanges`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={fabricRange.map((v) => ({
                          fabricRangeId: v.id,
                          label: v.name,
                        }))}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </label>
              )}
            </div>
          )}

          {selectedMesh !== null && fields[selectedMesh] && (
            <div className="mt-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleVariantAdd}
              >
                Add Mesh Variant
              </button>

              <dialog id="variant-dialog" className="modal">
                <div className="modal-box">
                  <form method="dialog" onSubmit={handleVariantSave}>
                    <button
                      type="button"
                      className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                      onClick={() =>
                        (
                          document.getElementById(
                            "variant-dialog"
                          ) as HTMLDialogElement
                        )?.close()
                      }
                    >
                      ✕
                    </button>

                    <h3 className="font-bold text-lg mb-4">Add Variant</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <label>
                        Variant Name:
                        <input
                          type="text"
                          name="variantName"
                          className="input input-bordered w-full"
                          required
                        />
                      </label>

                      <label>
                        Variant Description:
                        <input
                          type="text"
                          name="variantDescription"
                          className="input input-bordered w-full"
                        />
                      </label>

                      <label>
                        Variant Thumbnail:
                        <input
                          type="file"
                          name="variantThumbnail"
                          className="file-input input-bordered w-full"
                          accept="image/*"
                        />
                      </label>
                    </div>

                    <div className="modal-action">
                      <button type="submit" className="btn btn-primary">
                        Save Variant
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() =>
                          (
                            document.getElementById(
                              "variant-dialog"
                            ) as HTMLDialogElement
                          )?.close()
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </dialog>
            </div>
          )}
        </div>
      </dialog>
    );
  }
);

export default AddMash;
