import { addEnv } from "@/api";
import { modelUploadState } from "@/types/upload";
import { getFileExtension } from "@/utility/ext";
import { Trash2, Pencil } from "lucide-react";
import {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

const EnvEdited = ({
  name,
  setEnv: SetEnv,
}: {
  name: string;
  setEnv: Dispatch<SetStateAction<modelUploadState>>;
}) => {
  // State for environment entries
  const [env, setEnv] = useState<
    {
      name: string;
      file: ArrayBuffer;
      thumbnailUrl: ArrayBuffer;
      id?: number;
    }[]
  >([]);

  // Modal control states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<{
    file: ArrayBuffer | null;
    thumbnailUrl: ArrayBuffer | null;
    name: string;
    id?: number;
  }>({ file: null, thumbnailUrl: null, name: "" });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    thumbnailUrl?: string;
    file?: string;
  }>({});

  // Opens the modal for editing or adding new
  const openModal = (index: number | null = null) => {
    setEditingIndex(index);
    if (index !== null) {
      setDraft({ ...env[index] });
    } else {
      setDraft({ file: null, thumbnailUrl: null, name: "" });
    }
    setFormErrors({});
    (
      document.getElementById(`my_modal_fabrics_${name}`) as HTMLDialogElement
    )?.showModal();
  };

  // Handle file and thumbnail uploads
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    type: "file" | "thumbnailUrl"
  ) => {
    if (!e.target.files?.length) return;
    const buffer = await e.target.files[0].arrayBuffer();
    setDraft((prev) => ({ ...prev, [type]: buffer }));
    setFormErrors((prev) => ({ ...prev, [type]: undefined }));
  };

  // Handle name input
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDraft((prev) => ({ ...prev, name: e.target.value }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  // Save draft to env list
  const handleSave = () => {
    const errors: typeof formErrors = {};
    if (!draft.name) errors.name = "Name is required";
    if (!draft.thumbnailUrl) errors.thumbnailUrl = "Thumbnail is required";
    if (!draft.file) errors.file = "File is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setEnv((prev) => {
      const updated = [...prev];
      if (editingIndex !== null && editingIndex < updated.length) {
        updated[editingIndex] = { ...draft } as any;
      } else {
        updated.push(draft as any);
      }
      return updated;
    });

    setEditingIndex(null);
    setFormErrors({});
    (
      document.getElementById(`my_modal_fabrics_${name}`) as HTMLDialogElement
    ).close();
  };

  useEffect(() => {
    SetEnv((prv) => ({
      ...prv,
      env: env.map((item) => ({
        ...item,
        id: item.id ?? undefined, // Ensure id is explicitly set to undefined if not defined
      })),
    }));
  }, [env]);
  // Remove an env entry
  const handleRemove = (index: number) => {
    setEnv((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Upload all envs
  const onSubmit = async () => {
    if (env.length === 0) {
      console.warn("No environments to upload.");
      return;
    }

    const uploadFile = async (
      url: string,
      file: ArrayBuffer,
      fileName: string,
      fieldName: string
    ) => {
      const formData = new FormData();
      formData.append(fieldName, new File([file], fileName));

      try {
        const response = await fetch(url, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Failed to upload file: ${fileName}`);
        console.log(`${fileName} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading file ${fileName}:`, error);
      }
    };

    await Promise.all(
      env.map(async (fabric, i) => {
        if (fabric.id) return;

        try {
          const { data, config } = await addEnv({ name: fabric.name }, "");
          console.log(fabric);

          setEnv((prev) => {
            const updated = [...prev];
            updated[i] = { ...fabric, id: data.data.id } as any;
            return updated;
          });

          if (fabric.thumbnailUrl) {
            const ext = await getFileExtension(fabric.thumbnailUrl);
            await uploadFile(
              `${config.baseURL}/model/env-upload/thumbnail/${data.data.id}`,
              fabric.thumbnailUrl,
              `env_thumbnail_${fabric.name}.${ext}`,
              "env-thumbnail"
            );
          }

          if (fabric.file) {
            const ext = await getFileExtension(fabric.file);
            await uploadFile(
              `${config.baseURL}/model/env-upload/${data.data.id}`,
              fabric.file,
              `env__${fabric.name}.${ext}`,
              "env"
            );
          }
        } catch (error) {
          console.error("Error processing fabric:", error);
        }
      })
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {env.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-[16px] h-[16px]">
              <img src={URL.createObjectURL(new Blob([v.thumbnailUrl]))} />
            </div>
            <button
              className="btn btn-square btn-outline"
              onClick={() => handleRemove(i)}
            >
              <Trash2 size={16} />
            </button>
            <button
              className="btn btn-square btn-outline"
              onClick={() => openModal(i)}
            >
              <Pencil size={16} />
            </button>
          </div>
        ))}
        {env.length > 0 && (
          <button
            className="btn"
            onClick={onSubmit}
            disabled={env.some((v) => v.id !== undefined)}
          >
            Upload All
          </button>
        )}
      </div>

      <button className="btn" onClick={() => openModal(null)}>
        Add environment
      </button>

      <dialog id={`my_modal_fabrics_${name}`} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <fieldset className="space-y-2">
            <legend className="font-bold">Name</legend>
            <input
              type="text"
              className="input"
              value={draft.name}
              onChange={handleNameChange}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm">{formErrors.name}</p>
            )}

            <legend className="font-bold">Thumbnail</legend>
            <input
              type="file"
              className="file-input"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "thumbnailUrl")}
            />
            {formErrors.thumbnailUrl && (
              <p className="text-red-500 text-sm">{formErrors.thumbnailUrl}</p>
            )}

            <legend className="font-bold">Environment File</legend>
            <input
              type="file"
              className="file-input"
              accept=".hdr"
              onChange={(e) => handleFileChange(e, "file")}
            />
            {formErrors.file && (
              <p className="text-red-500 text-sm">{formErrors.file}</p>
            )}
          </fieldset>

          <button className="btn mt-4 w-full" onClick={handleSave}>
            Save
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default EnvEdited;
