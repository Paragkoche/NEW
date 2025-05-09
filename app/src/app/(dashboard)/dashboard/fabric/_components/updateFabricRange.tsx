import { getFabricRageById, updateFabricRageById } from "@/api";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
import { FabricRage } from "@/types/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forwardRef, Ref, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  id: z.number(),
  name: z.string().min(1, "Fabric range name is required"),
});

type FabricRangeFormData = z.infer<typeof schema>;

const UpdateFabricRange = forwardRef(
  (props: { id: number }, ref: Ref<HTMLDialogElement>) => {
    const [fabricRange, setFabricRange] = useState<FabricRage | null>(null);

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors, isSubmitting },
    } = useForm<FabricRangeFormData>({
      resolver: zodResolver(schema),
    });
    const router = useRouter();
    useEffect(() => {
      getFabricRageById(props.id).then(({ data }) => {
        setFabricRange(data);
        setValue("id", data.id);
        setValue("name", data.name); // Reset form values after data is fetched
      });
    }, [props.id, reset]);
    const { token } = useAuth();
    const onSubmit = async (data: FabricRangeFormData) => {
      try {
        if (!token) {
          throw new Error("token not found");
        }
        // Call your API to update the fabric range
        console.log("Updating fabric range:", data);
        await updateFabricRageById(token, props.id, {
          name: data.name,
        });
        window.location.reload();
        // Close dialog after successful update
        (ref as React.RefObject<HTMLDialogElement>)?.current?.close();
        router;
      } catch (error) {
        console.error("Failed to update fabric range:", error);
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

          <h3 className="font-bold text-lg">Update Fabric Range</h3>

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
                <p className="text-red-400 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Range"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }
);

export default UpdateFabricRange;
