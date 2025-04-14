"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

export default function AddUploadPop(props: {
  setArrayBuffer: Dispatch<SetStateAction<File[] | null>>;
  name: string;
}) {
  //   useEffect(() => {
  //     const modal = document.getElementById(
  //       "my_model_" + props.name
  //     ) as HTMLDialogElement | null;
  //     // modal?.showModal();
  //   }, []);

  const openModal = () => {
    const modal = document.getElementById(
      "my_model_" + props.name
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    props.setArrayBuffer((prv) =>
      prv
        ? [...prv, ...(e.target.files ? Array.from(e.target.files) : [])]
        : e.target.files
        ? Array.from(e.target.files)
        : []
    );
    const modal = document.getElementById(
      "my_model_" + props.name
    ) as HTMLDialogElement | null;
    modal?.close();
  };

  return (
    <div className="flex justify-center items-center">
      <button className="btn" onClick={openModal}>
        Add more model
      </button>

      <dialog id={"my_model_" + props.name} className="modal">
        <div className="modal-box">
          <input
            type="file"
            multiple
            accept=".glb"
            className="file-input file-input-ghost"
            onChange={handleFileChange}
          />
        </div>
      </dialog>
    </div>
  );
}
