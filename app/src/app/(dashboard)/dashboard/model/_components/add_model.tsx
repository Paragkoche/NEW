"use client";

import React, {
  DialogHTMLAttributes,
  forwardRef,
  Ref,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useModelUrl } from "../_ctx/model";
// import AddMash from "./add_mash";
import { Product } from "@/types/type";
import { getAllProduct } from "@/api";
import { FormDataType, schema } from "./form";
import Dimension from "@/components/Dimension";
import { Plus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API;

const formSchema = z.object({
  productId: z.string().min(1, "product is required"),
  name: z.string().min(1, "Model name is required"),
  isDefault: z.boolean().default(false),
  autoRotate: z.boolean().default(false),
  RotationSpeed: z.coerce.number().default(0),
  scale: z.coerce.number().default(0),
  dimensions: z.array(
    z.object({
      label: z.string().min(1, "label is required"),
      x: z.coerce.number().default(0),
      y: z.coerce.number().default(0),
      z: z.coerce.number().default(0),
      end_x: z.coerce.number().default(0),
      end_y: z.coerce.number().default(0),
      end_z: z.coerce.number().default(0),
    })
  ),
});

const AddModel = forwardRef((props: {}, ref: Ref<HTMLDialogElement>) => {
  const Form = useForm({
    resolver: zodResolver(formSchema),
  });

  const [products, setProducts] = useState<Product[]>([]);
  const addDimensions = useRef<HTMLDialogElement | any>(null);
  const dimensions = useFieldArray({
    control: Form.control,
    name: "dimensions",
  });
  const { modelUrl, updateModelUrl } = useModelUrl();
  const [thumbnailUrl, setThumbnailUrl] = useState<File | null>(null);
  useEffect(() => {
    getAllProduct().then((data) => setProducts(data.data));
    return () => {};
  }, []);
  return (
    <FormProvider {...Form}>
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
          <h3 className="font-bold text-lg mb-4">add Model</h3>
          <form>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Product</legend>
              <select defaultValue="Pick a browser" className="select">
                <option disabled={true}>Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <input type="text" className="input" {...Form.register("name")} />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Is Default</legend>
              <input
                type="checkbox"
                className="checkbox"
                {...Form.register("isDefault")}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Auto Rotate</legend>
              <input
                type="checkbox"
                className="checkbox"
                {...Form.register("autoRotate")}
              />
            </fieldset>
            {Form.watch("autoRotate") && (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Rotation Speed {Form.watch("RotationSpeed")}
                </legend>
                <input
                  type="range"
                  min={0}
                  max="5"
                  step={0.1}
                  className="range"
                  {...Form.register("RotationSpeed")}
                />
              </fieldset>
            )}

            <fieldset className="fieldset">
              <legend className="fieldset-legend">model</legend>
              <input
                type="file"
                className="file-input"
                accept=".glb, .gltf, .fbx, .obj"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  updateModelUrl(file as File);
                }}
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">thumbnail</legend>
              <input
                type="file"
                className="file-input"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setThumbnailUrl(file as File);
                }}
              />
            </fieldset>
            <button
              className="btn"
              type="button"
              onClick={() => {
                if (modelUrl && addDimensions.current) {
                  addDimensions.current.showModal();
                }
              }}
            >
              <Plus />
              Add Dimension
            </button>

            <button className="btn btn-active " type="submit">
              Submit
            </button>
          </form>
        </div>
      </dialog>
    </FormProvider>
  );
});

AddModel.displayName = "AddModel";
export default AddModel;
