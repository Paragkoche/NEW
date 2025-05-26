"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { boolean, set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
import { Fabric, FabricRage, Mash, MashVariants, Product } from "@/types/type";
import { get } from "http";
import { getAllFabricRage, getAllProduct } from "@/api";
import { use3DModelFromFile } from "../_ctx/mash";
import * as THREE from "three";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;
import MashFrom from "./_components/mashFrom";
import { log } from "console";
import { ModelViewer } from "../_components/add_dimensions";
const fileSchema = z
  .any()
  .refine((file) => file instanceof File && file.size > 0, {
    message: "File is required",
  });

const mashVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  url: z.string().min(1, "URL required"),
  thumbnailUrl: z.string().optional(),
  itOptional: z.boolean().default(false),
  textureEnable: z.boolean().default(false),
});

const fabricRangeSchema = z.object({
  fabricRageID: z.string(),
});

const mashSchema = z.object({
  name: z.string().min(1, "Mash name is required"),
  mashName: z.string().min(1, "Mash display name is required"),
  url: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  itOptional: z.boolean().default(false),
  textureEnable: z.boolean().default(false),
  fabricRange: z.array(fabricRangeSchema.optional()),
  mashVariants: z
    .object({
      name: z.string(),
      mash: z.array(mashVariantSchema).optional(),
    })
    .optional(),
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
  productId: z.coerce.string(),
  name: z.string().min(1, "Name is required"),
  isDefault: z.boolean().default(false),
  autoRotate: z.boolean().default(false),
  shadow: z.boolean().default(false),
  imageBank: z.string().optional(),

  RotationSpeed: z.coerce.number().default(0),
  scale: z.number().default(0),
  url: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  mash: z.array(mashSchema.optional()),
  dimensions: z
    .array(dimensionsSchema)
    .min(1, "At least one dimension is required"),
});

const defaultValues = {
  productId: "",
  name: "",
  isDefault: false,
  autoRotate: false,
  shadow: false,
  RotationSpeed: 0,
  imageBank: "",
  url: "",
  thumbnailUrl: "",
  mash: [],
  scale: 0.05,
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

type FileSource = {
  url: string;
  extension: "glb" | "obj";
};

function getMeshesFromScene(scene: THREE.Object3D): THREE.Mesh[] {
  const meshes: THREE.Mesh[] = [];

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  return meshes;
}

export default function ModelForm() {
  const [modelSource, setModelSource] = useState<FileSource | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
  console.log(errors);

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
      productId: String(data.productId),
      name: String(data.name),
      isDefault: Boolean(data.isDefault),
      autoRotate: Boolean(data.autoRotate),
      RotationSpeed: Number(data.RotationSpeed),
      shadow: Boolean(data.shadow),
      imageBank: String(data.imageBank),
      // Optionally you can add mash/dimensions if needed at backend
    };

    Object.entries(otherData).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/product/model/create-model`,
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
        ModelId: res.data.data.id,
      }));
      console.log(dimensionPayload);

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
      console.log(data);

      const mashPayload = data.mash.map((mash) => ({
        modelId: res.data.data.id, // Assuming `modelId` is returned from the model upload response
        name: mash?.name,
        mashName: mash?.mashName,
        fabricRanges: mash?.fabricRange.map((fabric: any) => ({
          fabricRangeId:
            fabric.fabricRageID == "" ? undefined : fabric.fabricRageID, // Assuming `fabricRageID` is used
        })),
        mashVariant: mash?.mashVariants?.name != "" && {
          name: mash?.mashVariants?.name,
          mash: mash!.mashVariants!.mash!.map((v) => ({
            thumbnailUrl: v.thumbnailUrl,
            url: v.url,
            itOptional: v.itOptional,
            mashName: mash?.mashName,
            name: v.name,
            textureEnable: v.textureEnable,
          })),
        },
        url: mash?.url,
        thumbnailUrl: mash?.thumbnailUrl,
        textureEnable: mash?.textureEnable,
        itOptional: mash?.itOptional,
      }));

      mashPayload.forEach(async (mash) => {
        const mashResponse = await axios.post(
          `${API_BASE_URL}/product/mash/create-mash`,
          mash,
          {
            headers: {
              Authorization: `Bearer ${token}`, // replace with real token
            },
          }
        );
        console.log("Mash created:", mashResponse.data);
      });

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
      console.log(uploadedUrl, response);

      setValue(fieldPath as any, uploadedUrl);
    } catch (error) {
      console.error(`Error uploading ${fieldPath}:`, error);
    }
  };
  const [products, setProducts] = React.useState<Product[]>([]);
  const [fabricRanges, setFabricRanges] = React.useState<FabricRage[]>([]);
  useEffect(() => {
    getAllProduct().then(({ data }) => {
      setProducts(data);
    });
    getAllFabricRage().then(({ data }) => {
      setFabricRanges(data);
    });
  }, []);
  console.log("THUM", watch("thumbnailUrl"));

  const [mash, setMash] = React.useState<Mash[]>([]);
  const model = use3DModelFromFile(modelFile);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded shadow"
    >
      {/* <label className="text-lg font-semibold">Add Model</label> */}
      <label className="text-sm">Product</label>
      <select
        {...register("productId")}
        className="select select-bordered w-full"
        onChange={(e) => {
          console.log(e.target.value);

          // Updating the form value
          setValue("productId", e.target.value);
        }}
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
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
        <input type="checkbox" {...register("shadow")} className="checkbox" />
        <span>Shadow</span>
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
        step="any"
        className="input input-bordered w-full"
      />
      <label className="text-sm">Scale</label>

      <input
        {...register("scale")}
        type="number"
        step="any"
        className="input input-bordered w-full"
      />

      {errors.RotationSpeed && (
        <p className="text-red-500 text-sm">{errors.RotationSpeed.message}</p>
      )}
      <label className="text-sm">model</label>

      <input
        type="file"
        accept=".gltf,.glb,.obj"
        // {...register("url", { required: true })}
        className="file-input file-input-bordered w-full"
        onChange={(e) => {
          handleFileUpload(e.target.files?.[0]!, "url");
          setModelFile(e.target.files?.[0] || null);
          alert(
            e.target.files?.[0]!.name.split(".").pop()?.toLowerCase()! as
              | "glb"
              | "obj"
          );
          setModelSource({
            url: URL.createObjectURL(e.target.files?.[0]!),
            extension: e.target.files?.[0]!.name.split(".")
              .pop()
              ?.toLowerCase()! as "glb" | "obj",
          });
          console.log(model);
        }}
      />
      {errors.url && (
        <p className="text-red-500 text-sm">{errors.url.message}</p>
      )}
      <label className="text-sm">thumbnail</label>

      <input
        type="file"
        accept="image/*"
        // {...register("thumbnailUrl", { required: true })}
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "thumbnailUrl")}
      />
      {errors.thumbnailUrl && (
        <p className="text-red-500 text-sm">{errors.thumbnailUrl.message}</p>
      )}

      <label className="text-sm">Image Bank</label>

      <input
        type="file"
        accept=".zip"
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "imageBank")}
      />
      {errors.imageBank && (
        <p className="text-red-500 text-sm">{errors.imageBank.message}</p>
      )}
      {mashFields.map((mash, i) => (
        <MashFrom
          key={mash.id}
          control={control}
          register={register}
          i={i}
          errors={errors}
          watch={watch}
          fabricRanges={fabricRanges}
          handleFileUpload={handleFileUpload}
        />
      ))}

      <button
        type="button"
        onClick={() => {
          console.log(getMeshesFromScene(model.object));

          if (model)
            getMeshesFromScene(model.object).forEach((key: any) => {
              appendMash({
                name: "",
                mashName: key.name,
                url: "",
                thumbnailUrl: "",
                itOptional: false,
                textureEnable: false,
                fabricRange: [{ fabricRageID: "" }],
                mashVariants: {
                  name: "",
                  mash: [],
                },
              });
            });
          else alert("Model is required");
        }}
        className="btn btn-outline"
      >
        Get All Mash in Model
      </button>

      {modelFile && modelSource && (
        <ModelViewer modelUrl={modelSource!} dimension={watch("dimensions")} />
      )}

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
            step="any"
            {...register(`dimensions.${i}.x`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">Y</label>
          <input
            type="number"
            step="any"
            {...register(`dimensions.${i}.y`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">Z</label>
          <input
            type="number"
            step="any"
            {...register(`dimensions.${i}.z`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End X</label>
          <input
            type="number"
            step="any"
            {...register(`dimensions.${i}.end_x`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End Y</label>
          <input
            type="number"
            step="any"
            {...register(`dimensions.${i}.end_y`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">End Z</label>
          <input
            type="number"
            step="any"
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
