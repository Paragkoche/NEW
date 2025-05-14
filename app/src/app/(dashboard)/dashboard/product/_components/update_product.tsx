"use client";

import React, { forwardRef, Ref, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";

const API_URL = process.env.NEXT_PUBLIC_API;

// Zod schema
const schema = z.object({
  name: z.string().min(1, "Product name is required"),
  pdf: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, {
      message: "PDF is required",
    })
    .optional(),
  thumbnail: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, {
      message: "PDF is required",
    })
    .optional(),
});

type FormDataType = z.infer<typeof schema>;

const UpdateProduct = forwardRef(
  (props: { id: number }, ref: Ref<HTMLDialogElement>) => {
    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<FormDataType>({
      resolver: zodResolver(schema),
    });
    const { token } = useAuth();
    useEffect(() => {
      // Fetch product data to prefill form
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/product/get-product/${props.id}`
          );
          const product = response.data;
          setValue("name", product.name);
          setValue(
            "pdf",
            (product.pdfText as string).replace(/\\n/g, "\n")
            //   toast.error("Failed to load product data.");
          ); // Assuming it's a text field in the DB
        } catch (error) {
          //   toast.error("Failed to load product data.");
          console.error(error);
        }
      };

      fetchData();
    }, [props.id, setValue]);

    const onSubmit = async (data: FormDataType) => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);

        if (data.thumbnail?.[0]) {
          formData.append("thumbnail", data.thumbnail[0]);
        }
        if (data.pdf?.[0]) {
          formData.append("pdf", data.pdf[0]);
        }
        console.log(formData.getAll("pdf"));

        await axios.put(
          `${API_URL}/product/update-product/${props.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",

              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Product updated successfully!");
        window.location.reload();
        (ref as React.RefObject<HTMLDialogElement>)?.current?.close();
      } catch (error) {
        toast.error("Failed to update product.");
        console.error(error);
      }
    };

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box max-w-md">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() =>
              (ref as React.RefObject<HTMLDialogElement>)?.current?.close()
            }
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4">Update Product</h3>

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
              <label className="label">PDF Text (URL or base64)</label>
              <input
                type="file"
                accept="application/pdf"
                className="file-input file-input-bordered w-full"
                {...register("pdf")}
              />
            </div>

            <div>
              <label className="label">Thumbnail (optional)</label>
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
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

UpdateProduct.displayName = "UpdateProduct";
export default UpdateProduct;
