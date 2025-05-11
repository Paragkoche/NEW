import { FabricRage, Mash } from "@/types/type";
import { useFieldArray } from "react-hook-form";

const mashFrom = (props: {
  i: number;

  fabricRanges: FabricRage[];
  register: any;
  control: any;
  watch: any;
  errors: any;
  handleFileUpload: (file: File, fieldName: string) => void;
}) => {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: props.control,
    name: `mash.${props.i}.mashVariants.mash`,
  });
  const {
    fields: fabricFields,
    append: appendFabric,
    remove: removeFabric,
  } = useFieldArray({
    control: props.control,
    name: `mash.${props.i}.fabricRange`,
  });
  return (
    <div key={props.i} className="border p-4 space-y-2 rounded bg-gray-50">
      <label className="text-sm">name</label>

      <input
        {...props.register(`mash.${props.i}.name`)}
        className="input input-bordered w-full"
      />
      <label className="text-sm">mash name</label>

      <input
        {...props.register(`mash.${props.i}.mashName`)}
        className="input input-bordered w-full"
      />
      {/* <label className="text-sm">model</label>
      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) =>
          props.handleFileUpload(e.target.files?.[0]!, `mash.${props.i}.url`)
        }
      /> */}
      <label className="text-sm">thumbnail</label>

      <input
        type="file"
        className="file-input file-input-bordered w-full"
        onChange={(e) =>
          props.handleFileUpload(
            e.target.files?.[0]!,
            `mash.${props.i}.thumbnailUrl`
          )
        }
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...props.register(`mash.${props.i}.itOptional`)}
        />
        <span>Optional</span>
      </label>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...props.register(`mash.${props.i}.textureEnable`)}
        />
        <span>Texture Enabled</span>
      </label>

      {props.watch(`mash.${props.i}.textureEnable`) &&
        fabricFields.map((field, j) => (
          <div key={field.id} className="flex items-center space-x-2">
            <div className="w-full">
              <label className="text-sm">Fabric Range ID</label>
              <select
                {...props.register(
                  `mash.${props.i}.fabricRange.${j}.fabricRageID`
                )}
                className="select select-bordered w-full"
              >
                <option value="">Select Fabric Range</option>
                {props.fabricRanges.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {props.errors?.mash?.[props.i]?.fabricRange?.[j]
                ?.fabricRageID && (
                <p className="text-red-500 text-sm">
                  {
                    props.errors.mash[props.i].fabricRange[j].fabricRageID
                      .message
                  }
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
      {props.watch(`mash.${props.i}.textureEnable`) && (
        <button
          type="button"
          onClick={() => appendFabric({ fabricRageID: "" })}
          className="btn btn-outline btn-sm mt-2"
        >
          Add Fabric Range
        </button>
      )}
      <br />

      {props.watch(`mash.${props.i}.mashVariants.mash`).length != 0 && (
        <>
          <label> Mash Variants Name</label>
          <input
            {...props.register(`mash.${props.i}.mashVariants.name`)}
            className="input input-bordered w-full"
          />
        </>
      )}
      {variantFields.map((variant, k) => (
        <div key={variant.id} className="border p-2 rounded bg-white">
          <label>Name</label>
          <input
            {...props.register(`mash.${props.i}.mashVariants.mash.${k}.name`)}
            className="input input-bordered w-full"
          />
          <label className="text-sm">model</label>

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            required
            onChange={(e) =>
              props.handleFileUpload(
                e.target.files?.[0]!,
                `mash.${props.i}.mashVariants.mash.${k}.url`
              )
            }
          />
          <label className="text-sm">thumbnailUrl</label>

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            required
            onChange={(e) =>
              props.handleFileUpload(
                e.target.files?.[0]!,
                `mash.${props.i}.mashVariants.mash.${k}.thumbnailUrl`
              )
            }
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...props.register(
                `mash.${props.i}.mashVariants.mash.${k}.itOptional`
              )}
            />
            <span>Optional</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...props.register(
                `mash.${props.i}.mashVariants.mash.${k}.textureEnable`
              )}
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
};

export default mashFrom;
