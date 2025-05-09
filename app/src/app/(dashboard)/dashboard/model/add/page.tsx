"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const fileSchema = z
  .any()
  .refine((file) => file instanceof File && file.size > 0, {
    message: "File is required",
  });

const mashVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  url: z.string().min(1, "URL required"),
  thumbnailUrl: z.string().min(1, "Thumbnail required"),
  itOptional: z.boolean().default(false),
  textureEnable: z.boolean().default(false),
});

const fabricRangeSchema = z.object({
  fabricRageID: z.string().min(1, "Fabric Rage ID is required"),
});

const mashSchema = z.object({
  name: z.string().min(1, "Mash name is required"),
  mashName: z.string().min(1, "Mash display name is required"),
  url: z.string().min(1, "Mash URL is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  itOptional: z.boolean().default(false),
  textureEnable: z.boolean().default(false),
  fabricRange: z
    .array(fabricRangeSchema)
    .min(1, "At least one fabric is required"),
  mashVariants: z.array(mashVariantSchema).optional(),
});

const dimensionsSchema = z.object({
  label: z.string().min(1, "Label is required"),
  x: z.coerce.number(),
  y: z.coerce.number(),
  z: z.coerce.number(),
  end_x: z.coerce.number(),
  end_y: z.coerce.number(),
  end_z: z.coerce.number(),
});

const modelSchema = z.object({
  productId: z.coerce.number().min(1, "Product ID is required"),
  name: z.string().min(1, "Name is required"),
  isDefault: z.boolean().default(false),
  autoRotate: z.boolean().default(false),
  RotationSpeed: z.coerce.number().default(0),
  url: z.string().min(1, "URL is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  mash: z.array(mashSchema).min(1, "At least one mash is required"),
  dimensions: z
    .array(dimensionsSchema)
    .min(1, "At least one dimension is required"),
});

const defaultValues = {
  productId: 1,
  name: "",
  isDefault: false,
  autoRotate: false,
  RotationSpeed: 0,
  url: "",
  thumbnailUrl: "",
  mash: [
    {
      name: "",
      mashName: "",
      itOptional: false,
      textureEnable: false,
      url: "",
      thumbnailUrl: "",
      fabricRange: [{ fabricRageID: "" }],
      mashVariants: [],
    },
  ],
  dimensions: [
    {
      label: "",
      x: 0,
      y: 0,
      z: 0,
      end_x: 0,
      end_y: 0,
      end_z: 0,
    },
  ],
};

export default function ModelForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(modelSchema),
    defaultValues,
  });

  const { fields: mashFields, append: appendMash } = useFieldArray({
    control,
    name: "mash",
  });

  const { fields: dimensionFields, append: appendDimension } = useFieldArray({
    control,
    name: "dimensions",
  });
  const [modelFile, setModelFile] = React.useState<File | null>(null);
  const [modelThumbnail, setModelThumbnail] = React.useState<File | null>(null);

  const { token } = useAuth();
  const onSubmit = async (data: z.infer<typeof modelSchema>) => {
    const formData = new FormData();

    // Append the file manually if stored separately

    if (!modelFile || !(modelFile instanceof File)) {
      alert("Model file is required.");
      return;
    }

    formData.append("model", modelFile);

    // Flatten the rest of the form fields into a JSON string
    const otherData = {
      productId: data.productId,
      name: data.name,
      isDefault: data.isDefault,
      autoRotate: data.autoRotate,
      RotationSpeed: data.RotationSpeed,
      // Optionally you can add mash/dimensions if needed at backend
    };

    Object.entries(otherData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/product/create-model`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Replace with actual token handling
          },
        }
      );

      console.log("Model created:", res.data);

      // 2. Submit dimensions after model is successfully created
      const dimensionPayload = data.dimensions.map((v) => ({
        ...v,
        ModelId: res.data.id,
      }));

      const dimensionsResponse = await axios.post(
        `${API_BASE_URL}/product/dimensions/create`,
        dimensionPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // replace with real token
          },
        }
      );

      console.log("Dimensions created:", dimensionsResponse.data);
      alert("Model and dimensions created successfully!");

      const mashPayload = data.mash.map((mash: any) => ({
        modelId: res.data.modelId, // Assuming `modelId` is returned from the model upload response
        name: mash.name,
        mashName: mash.mashName,
        fabricRanges: mash.fabricRange.map((fabric: any) => ({
          fabricRangeId: fabric.fabricRageID, // Assuming `fabricRageID` is used
        })),
        mashVariants: mash.mashVariants.map((variant: any) => ({
          name: variant.name,
          mash: variant.mash.map((mash: any) => ({
            modelId: mash.modelId,
            itOptional: mash.itOptional,
            textureEnable: mash.textureEnable,
            name: mash.name,
            mashName: mash.mashName,
            fabricRanges: mash.fabricRanges.map((fabric: any) => ({
              fabricRangeId: fabric.fabricRangeId,
            })),
          })),
        })),
        url: mash.url,
        thumbnailUrl: mash.thumbnailUrl,
      }));

      const mashResponse = await axios.post(
        `${API_BASE_URL}/product/mash/create-mash`,
        mashPayload,
        {
          headers: {
            Authorization: `Bearer YOUR_TOKEN_HERE`, // replace with real token
          },
        }
      );

      console.log("Mash created:", mashResponse.data);
      alert("Model, dimensions, and mash created successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleFileUpload = async (file: File, fieldPath: string) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/product/upload-mash`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const uploadedUrl = response.data.url || response.data;
      setValue(fieldPath as any, uploadedUrl);
    } catch (error) {
      console.error(`Error uploading ${fieldPath}:`, error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded shadow"
    >
      {/* <label className="text-lg font-semibold">Add Model</label> */}
      <label className="text-sm">Product</label>
      <input
        {...register("productId")}
        type="number"
        className="input input-bordered w-full"
      />
      {errors.productId && (
        <p className="text-red-500 text-sm">{errors.productId.message}</p>
      )}
      <label className="text-sm">Name</label>

      <input
        {...register("name")}
        type="text"
        className="input input-bordered w-full"
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register("isDefault")}
          className="checkbox"
        />
        <span>Is Default</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register("autoRotate")}
          className="checkbox"
        />
        <span>Auto Rotate</span>
      </label>
      <label className="text-sm">Rotate speed</label>

      <input
        {...register("RotationSpeed")}
        type="number"
        className="input input-bordered w-full"
      />

      {errors.RotationSpeed && (
        <p className="text-red-500 text-sm">{errors.RotationSpeed.message}</p>
      )}
      <label className="text-sm">model</label>

      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "url")}
      />
      {errors.url && (
        <p className="text-red-500 text-sm">{errors.url.message}</p>
      )}
      <label className="text-sm">thumbnail</label>

      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "thumbnailUrl")}
      />
      {errors.thumbnailUrl && (
        <p className="text-red-500 text-sm">{errors.thumbnailUrl.message}</p>
      )}

      {mashFields.map((mash, i) => {
        const {
          fields: variantFields,
          append: appendVariant,
          remove: removeVariant,
        } = useFieldArray({
          control,
          name: `mash.${i}.mashVariants`,
        });
        const {
          fields: fabricFields,
          append: appendFabric,
          remove: removeFabric,
        } = useFieldArray({
          control,
          name: `mash.${i}.fabricRange`,
        });
        return (
          <div
            key={mash.id}
            className="border p-4 space-y-2 rounded bg-gray-50"
          >
            <label className="text-sm">name</label>

            <input
              {...register(`mash.${i}.name`)}
              className="input input-bordered w-full"
            />
            <label className="text-sm">mash name</label>

            <input
              {...register(`mash.${i}.mashName`)}
              className="input input-bordered w-full"
            />
            <label className="text-sm">model</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) =>
                handleFileUpload(e.target.files?.[0]!, `mash.${i}.url`)
              }
            />
            <label className="text-sm">thumbnail</label>

            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={(e) =>
                handleFileUpload(e.target.files?.[0]!, `mash.${i}.thumbnailUrl`)
              }
            />
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register(`mash.${i}.itOptional`)} />
              <span>Optional</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" {...register(`mash.${i}.textureEnable`)} />
              <span>Texture Enabled</span>
            </label>

            {fabricFields.map((field, j) => (
              <div key={field.id} className="flex items-center space-x-2">
                <div className="w-full">
                  <label className="text-sm">Fabric Range ID</label>
                  <input
                    {...register(`mash.${i}.fabricRange.${j}.fabricRageID`)}
                    className="input input-bordered w-full"
                  />
                  {errors?.mash?.[i]?.fabricRange?.[j]?.fabricRageID && (
                    <p className="text-red-500 text-sm">
                      {errors.mash[i].fabricRange[j].fabricRageID.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFabric(j)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendFabric({ fabricRageID: "" })}
              className="btn btn-outline btn-sm mt-2"
            >
              Add Fabric Range
            </button>
            <br />

            {variantFields.map((variant, k) => (
              <div key={variant.id} className="border p-2 rounded bg-white">
                <input
                  {...register(`mash.${i}.mashVariants.${k}.name`)}
                  className="input input-bordered w-full"
                />
                <label className="text-sm">model</label>

                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) =>
                    handleFileUpload(
                      e.target.files?.[0]!,
                      `mash.${i}.mashVariants.${k}.url`
                    )
                  }
                />
                <label className="text-sm">thumbnailUrl</label>

                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) =>
                    handleFileUpload(
                      e.target.files?.[0]!,
                      `mash.${i}.mashVariants.${k}.thumbnailUrl`
                    )
                  }
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`mash.${i}.mashVariants.${k}.itOptional`)}
                  />
                  <span>Optional</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`mash.${i}.mashVariants.${k}.textureEnable`)}
                  />
                  <span>Texture Enabled</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeVariant(k)}
                  className="btn btn-error mt-2"
                >
                  Delete Variant
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                appendVariant({
                  name: "",
                  url: "",
                  thumbnailUrl: "",
                  itOptional: false,
                  textureEnable: false,
                })
              }
              className="btn btn-secondary"
            >
              Add Variant
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          appendMash({
            name: "",
            mashName: "",
            url: "",
            thumbnailUrl: "",
            itOptional: false,
            textureEnable: false,
            fabricRange: [{ fabricRageID: "" }],
            mashVariants: [],
          })
        }
        className="btn btn-outline"
      >
        Add Mash
      </button>

      {dimensionFields.map((dim, i) => (
        <div key={dim.id} className="grid grid-cols-2 gap-2">
          <label className="text-sm">Label</label>
          <input
            {...register(`dimensions.${i}.label`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">X</label>
          <input
            type="number"
            {...register(`dimensions.${i}.x`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">Y</label>
          <input
            type="number"
            {...register(`dimensions.${i}.y`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">Z</label>
          <input
            type="number"
            {...register(`dimensions.${i}.z`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End X</label>
          <input
            type="number"
            {...register(`dimensions.${i}.end_x`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End Y</label>
          <input
            type="number"
            {...register(`dimensions.${i}.end_y`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End Z</label>
          <input
            type="number"
            {...register(`dimensions.${i}.end_z`)}
            className="input input-bordered w-full"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendDimension({
            label: "",
            x: 0,
            y: 0,
            z: 0,
            end_x: 0,
            end_y: 0,
            end_z: 0,
          })
        }
        className="btn btn-outline"
      >
        Add Dimension
      </button>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
}
