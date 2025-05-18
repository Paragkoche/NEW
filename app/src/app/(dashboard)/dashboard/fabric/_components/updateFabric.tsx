"use client";

import React, { forwardRef, Ref, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
import { Fabric, FabricRage } from "@/types/type";
import { getAllFabricRage, getFabricById } from "@/api";
import axios from "axios";
import { fabrics } from "@/types/upload";
const API_URL = process.env.NEXT_PUBLIC_API;
// Zod schema for validation
const schema = z.object({
  id: z.string(),
  FabricRageId: z.coerce.string().min(1, "Fabric Range is required"),

  name: z.string().min(1, "Name is required"),
  size: z.coerce.number().min(1, "Size is required"),
  thumbnail: z.any().optional(),
  fabric: z.any().optional(), // This will handle multiple fabric files
});

type FormDataType = z.infer<typeof schema>;

const UpdateFabric = forwardRef(
  (
    props: {
      id: string;
    },
    ref: Ref<HTMLDialogElement>
  ) => {
    const [fabricRange, setFabricRange] = useState<Fabric | null>(null);

    const {
      register,
      handleSubmit,
      reset,
      control,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<FormDataType>({
      resolver: zodResolver(schema),
      defaultValues: {
        FabricRageId: "",

        name: "",
        size: 0,
        thumbnail: undefined,
        fabric: undefined,
      },
    });
    useEffect(() => {
      getFabricById(props.id).then(({ data }) => {
        console.log(data);

        setFabricRange(data);
        setValue("id", data.id);
        setValue("name", data.name); // Reset form values after data is fetched
        setValue("FabricRageId", data?.fabricRage?.id || ""); // Reset form values after data is fetched
        setValue("size", data?.size || 0); // Reset form values after data is fetched
        // Reset form values after data is fetched
      });
    }, [props.id, reset]);
    const [fabricRang, setFabricRang] = useState<FabricRage[]>([]);
    useEffect(() => {
      getAllFabricRage().then((data) => setFabricRang(data.data));
      return () => {};
    }, []);

    const { fields, append, remove } = useFieldArray({
      control,
      name: "fabrics",
    });
    const { token } = useAuth();

    // Handle form submission
    const onSubmit = async (data: FormDataType) => {
      try {
        const formData = new FormData();

        // Append FabricRageId
        formData.append("FabricRageId", String(data.FabricRageId));

        // Append individual fabric fields
        formData.append("name", data.name);
        formData.append("size", String(data.size));

        // Append thumbnail if present
        if (data.thumbnail?.[0]) {
          formData.append("thumbnail", data.thumbnail[0]);
        }

        // Append fabric file if present
        if (data.fabric?.[0]) {
          formData.append("fabric", data.fabric[0]);
        }

        try {
          await axios.request({
            method: "put",
            maxBodyLength: Infinity,
            url: API_URL + "/product/fabric/update-fabric/" + props.id,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            data: formData,
          });

          // if (response.status !== 200) {
          //   throw new Error(`Failed to create fabric at index ${index}`);
          // }
        } catch (err) {
          console.error(`Error creating fabric :`, err);
        }

        toast.success("All fabrics created successfully!");
        reset();
        // window.location.reload();
        (ref as React.RefObject<HTMLDialogElement>)?.current?.close();
      } catch (error) {
        toast.error("Something went wrong while creating fabrics.");
        console.error(error);
      }
    };

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box max-w-md">
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

          <h3 className="font-bold text-lg mb-4">Add Multiple Fabrics</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Fabric Range ID Selection */}
            <div>
              <label className="label">Fabric Range ID</label>
              <select
                {...register("FabricRageId")}
                className="select select-bordered w-full"
              >
                {fabricRang.map((v, i) => (
                  <option key={i} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {errors.FabricRageId && (
                <p className="text-red-400">{errors.FabricRageId.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  {...register(`name`)}
                />
                {errors.name && (
                  <p className="text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label">Size</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  {...register(`size`)}
                />
                {errors.size && (
                  <p className="text-red-400">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="label">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  {...register(`thumbnail`)}
                />
              </div>

              <div>
                <label className="label">Fabric Files</label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  multiple
                  {...register(`fabric`)}
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Update Fabrics"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

UpdateFabric.displayName = "UpdateFabric";
export default UpdateFabric;
