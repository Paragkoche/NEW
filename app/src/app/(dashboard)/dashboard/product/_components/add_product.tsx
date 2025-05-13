"use client";

import React, { forwardRef, Ref } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API;

// Zod schema
const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  pdfText: z.any().refine((file) => file?.length === 1, "PDF file is required"),
  thumbnail: z
    .any()
    .refine((file) => file?.length === 1, "PDF file is required"),
});

type FormDataType = z.infer<typeof schema>;

const AddProduct = forwardRef((props: {}, ref: Ref<HTMLDialogElement>) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormDataType) => {
    console.log(data.thumbnail);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("pdf", data.pdfText[0]);
      formData.append("thumbnail", data.thumbnail[0]);

      await axios.post(`${API_URL}/product/create-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully!");

      window.location.reload();
      (ref as React.RefObject<HTMLDialogElement>)?.current?.close();
    } catch (error) {
      toast.error("Failed to create product.");
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

        <h3 className="font-bold text-lg mb-4">Add Product</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Product Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label">PDF File</label>
            {/* <textarea
              className="file-input file-input-bordered w-full"
              {...register("pdfText")}
            ></textarea> */}
            <input
              type="file"
              accept="application/pdf"
              className="file-input file-input-bordered w-full"
              {...register("pdfText")}
            />
          </div>
          <div>
            <label className="label">thumbnail</label>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              {...register("thumbnail")}
            />
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});

AddProduct.displayName = "AddProduct";
export default AddProduct;
