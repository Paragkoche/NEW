"use client";

import React, { use, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
// optional: extract your schema to a separate file
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
import { getAllFabricRage, getAllProduct } from "@/api";
import { ModelViewer } from "../../_components/add_dimensions";
import MashFrom from "../../add/_components/mashFrom";
import { z } from "zod";
import { FabricRage, Product } from "@/types/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

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
});

const defaultValues = {
  productId: 1,
  name: "",
  isDefault: false,
  autoRotate: false,
  shadow: false,
  RotationSpeed: 0,
  imageBank: "",
  url: "",
  thumbnailUrl: "",
};

export default function ModelUpdateForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [modelData, setModelData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [fabricRanges, setFabricRanges] = useState<FabricRage[]>([]);
  const { token } = useAuth();
  const { id } = use(params);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(modelSchema),
    defaultValues: undefined, // populated via `reset()`
  });

  useEffect(() => {
    getAllProduct().then(({ data }) => setProducts(data));
    getAllFabricRage().then(({ data }) => setFabricRanges(data));

    // Fetch the existing model by ID
    const fetchModel = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/product/model/get-model-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;
        setModelData(data);

        // Format and populate form
        reset({
          productId: data.product.id,
          name: data.name,
          isDefault: data.isDefault,
          shadow: data.shadow,
          autoRotate: data.autoRotate,
          RotationSpeed: data.RotationSpeed,
          imageBank: data.imageBank,
          url: data.url,
          scale: data.scale || 0,
          thumbnailUrl: data.thumbnailUrl ?? "",
        });
      } catch (error) {
        console.error("Failed to load model", error);
      }
    };

    fetchModel();
  }, [id]);

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
      const uploadedUrl = response.data.url;
      setValue(fieldPath as any, uploadedUrl);
    } catch (error) {
      console.error(`Error uploading ${fieldPath}:`, error);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        RotationSpeed: Number(data.RotationSpeed),
        productId: Number(data.productId),
      };

      const res = await axios.put(
        `${API_BASE_URL}/product/model/update-model/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Model updated:", res.data);

      alert("Model updated successfully!");
    } catch (error) {
      console.error("Failed to update model:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-semibold">Update Model</h2>

      <label className="text-sm">Product</label>
      <select
        {...register("productId")}
        className="select select-bordered w-full"
      >
        <option value="">Select a product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>

      <label className="text-sm">Name</label>
      <input {...register("name")} className="input input-bordered w-full" />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="checkbox"
          />
          <span>Is Default</span>
        </label>
        {errors.isDefault && (
          <p className="text-red-500 text-sm">{errors.isDefault.message}</p>
        )}
        <label className="flex items-center space-x-2">
          <input type="checkbox" {...register("shadow")} className="checkbox" />
          <span>Shadow</span>
        </label>
        {errors.shadow && (
          <p className="text-red-500 text-sm">{errors.shadow.message}</p>
        )}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("autoRotate")}
            className="checkbox"
          />
          <span>Auto Rotate</span>
        </label>
        {errors.autoRotate && (
          <p className="text-red-500 text-sm">{errors.autoRotate.message}</p>
        )}
      </div>

      <label className="text-sm">Rotation Speed</label>
      <input
        type="number"
        {...register("RotationSpeed")}
        className="input input-bordered w-full"
      />
      <label className="text-sm">Scale</label>
      <input
        type="number"
        {...register("scale")}
        className="input input-bordered w-full"
      />

      <label className="text-sm">Update Thumbnail</label>
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "thumbnailUrl")}
      />
      {errors.thumbnailUrl && (
        <p className="text-red-500 text-sm">{errors.thumbnailUrl.message}</p>
      )}

      <label className="text-sm">Image Bank (zip)</label>
      <input
        type="file"
        accept=".zip"
        className="file-input file-input-bordered w-full"
        onChange={(e) => handleFileUpload(e.target.files?.[0]!, "imageBank")}
      />
      {errors.imageBank && (
        <p className="text-red-500 text-sm">{errors.imageBank.message}</p>
      )}
      <button type="submit" className="btn btn-primary w-full">
        Update Model
      </button>
    </form>
  );
}
