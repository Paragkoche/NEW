"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

export default function UploadPop(props: {
  setArrayBuffer: Dispatch<SetStateAction<File[] | null>>;
  setThumbnailBuffer: Dispatch<SetStateAction<File | null>>;
  setName: Dispatch<SetStateAction<string | null>>;
  setSubmit: () => void;
  name: string;
}) {
  useEffect(() => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  }, []);

  const openModal = () => {
    const modal = document.getElementById(
      "my_modal_3"
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    props.setArrayBuffer(Array.from(e.target.files));
  };
  const handleThumbnailFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);

    if (!e.target.files) return;
    props.setThumbnailBuffer(e.target.files[0]);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <button className="btn" onClick={openModal}>
        Add Modal
      </button>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box gap-2 flex flex-col">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Product name</legend>
            <input
              type="text"
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
              className="input"
              placeholder="Type here"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Model</legend>
            <input
              type="file"
              multiple
              accept=".glb"
              className="file-input file-input-ghost"
              placeholder="s"
              onChange={handleFileChange}
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Thumbnail</legend>
            <input
              type="file"
              multiple
              accept="image/*"
              className="file-input file-input-ghost"
              placeholder="s"
              onChange={handleThumbnailFileChange}
            />
          </fieldset>
          <button className="btn" type="button" onClick={props.setSubmit}>
            {" "}
            submit
          </button>
        </div>
      </dialog>
    </div>
  );
}
