import { addBg } from "@/api";
import { modelUploadState } from "@/types/upload";
import { Pipette, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const ColorPiker = (props: {
  setBgs: Dispatch<SetStateAction<modelUploadState>>;
}) => {
  const [bgs, setBgs] = useState<{ color: string; id?: number }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    props.setBgs((prv) => ({
      ...prv,
      bgs,
    }));
  }, [bgs]);

  const openModal = (index: number | null = null) => {
    if (index === null) {
      setBgs((prev) => [...prev, { color: "#ffffff" }]);
      setEditingIndex(bgs.length);
    } else {
      setEditingIndex(index);
    }

    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleColorChange = (value: string) => {
    setBgs((prev) => {
      const updated = [...prev];
      if (editingIndex !== null) {
        updated[editingIndex] = { color: value };
      }
      return updated;
    });
  };

  const handleSave = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    modal?.close();
    setEditingIndex(null);

    setBgs((prev) => {
      const uniqueBgs = bgs.filter(
        (bg, index, self) =>
          index === self.findIndex((t) => t.color === bg.color)
      );
      return uniqueBgs;
    });
  };

  const handleRemove = (index: number) => {
    setBgs((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    props.setBgs((prev) => ({
      ...prev,
      bgs: bgs
        .filter((_, i) => i !== index)
        .map((color) => ({ color: color.color })),
    }));
  };

  const handleUploadAll = () => {
    const newBgs = bgs.filter((bg) => !bg.id);
    if (newBgs.length === 0) return;

    addBg(newBgs, "").then(({ data }) => {
      setBgs(data.data);
      props.setBgs((prev) => ({
        ...prev,
        bgs: data.data,
      }));
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {bgs.map((color, i) => (
          <div key={i} className="flex items-center gap-1">
            <button
              className="btn"
              style={{ backgroundColor: color.color, color: "#fff" }}
              onClick={() => openModal(i)}
            >
              {color.color}
            </button>
            <button
              className="btn btn-square btn-outline"
              onClick={() => handleRemove(i)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {bgs.length !== 0 && (
          <div>
            <button
              className="btn"
              onClick={handleUploadAll}
              disabled={bgs.every((bg) => bg.id)}
            >
              Upload All
            </button>
          </div>
        )}
      </div>

      <button className="btn" onClick={() => openModal(null)}>
        Add bg Color
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <label className="input mt-4 flex items-center gap-2">
            <Pipette />
            <input
              type="color"
              value={
                editingIndex !== null ? bgs[editingIndex].color : "#ffffff"
              }
              onChange={(e) => handleColorChange(e.target.value)}
            />
          </label>

          <button className="btn mt-4 w-full" onClick={handleSave}>
            Save
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ColorPiker;
