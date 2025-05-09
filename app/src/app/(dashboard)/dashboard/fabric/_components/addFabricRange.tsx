"use client";

import { forwardRef, Ref } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PostFabricRage } from "@/api";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

// Validation schema
const schema = z.object({
  name: z.string().min(1, "Fabric range name is required"),
});

type FabricRangeFormData = z.infer<typeof schema>;

const AddFabricRange = forwardRef((props: {}, ref: Ref<HTMLDialogElement>) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FabricRangeFormData>({
    resolver: zodResolver(schema),
  });
  const { token } = useAuth();
  const onSubmit = async (data: FabricRangeFormData) => {
    try {
      if (!token) {
        throw new Error("user not login, login again");
      }
      console.log("Submitting fabric range:", data);
      await PostFabricRage(token, data);
      toast.success(`Fabric range "${data.name}" added!`);
      reset();
      window.location.reload();

      (ref as React.RefObject<HTMLDialogElement>)?.current?.close();
    } catch (error) {
      toast.error("Failed to add fabric range.", {
        description: (error as AxiosError<{ message: string }>).response?.data
          .message,
      });
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
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

        <h3 className="font-bold text-lg">Add Fabric Range</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Summer Collection"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Range"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});

AddFabricRange.displayName = "AddFabricRange";
export default AddFabricRange;
