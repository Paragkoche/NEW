"use client";
import { useEffect, useState } from "react";
import UploadPop from "../../_components/upload-pop";
import TabEdit from "../../_components/tab-edit";
import EnvEdited from "../../_components/env";
import AddUploadPop from "../../_components/add-upload-pop";
import ColorPiker from "../../_components/color-piker";
import { modelUploadState } from "@/types/upload";
import { addProduct, connectEveryThinks } from "@/api";
import { v4 as uuidv4 } from "uuid";
const Page = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [ThumbnailFiles, setThumbnailFiles] = useState<File | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [buffers, setBuffers] = useState<ArrayBuffer[] | null>(null);
  const [itSubmit, setSubmit] = useState<boolean>(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [modelSetting, setModelSetting] = useState<modelUploadState>({
    autoRotate: false,
    modelName: "",
    rotationSpeed: 0,
    shadow: false,
    bgs: [],
    env: [],
    isDefault: false,
    mash: [],
  });

  useEffect(() => {
    const convertToBuffers = async () => {
      if (files) {
        const loadedBuffers = await Promise.all(
          files.map((file) => file.arrayBuffer())
        );
        setBuffers(loadedBuffers);
      }
    };
    convertToBuffers();
  }, [files]);

  if (itSubmit == false || !files || !productId) {
    return (
      <div>
        <UploadPop
          setArrayBuffer={setFiles}
          setThumbnailBuffer={setThumbnailFiles}
          setName={setName}
          name={name || ""}
          setSubmit={async () => {
            console.log("s");

            if (!name || !files || !ThumbnailFiles) {
              alert("Input not valid");
              return;
            }
            await addProduct({ name: name || "" }, "")
              .then(({ data, config }) => {
                console.log("done");
                const formData = new FormData();
                formData.append("thumbnail", ThumbnailFiles as Blob);

                fetch(
                  config.baseURL +
                    "/model/product-upload-thumbnail/" +
                    data.data.id,
                  {
                    method: "POST",
                    body: formData,
                  }
                )
                  .then((response) => {
                    if (response.ok) {
                      console.log("Thumbnail uploaded successfully");
                      setProductId(data.data.id);
                      setSubmit(true);
                    } else {
                      console.error("Failed to upload thumbnail");
                    }
                  })
                  .catch((error) => {
                    console.error("Error uploading thumbnail:", error);
                  });
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        />
      </div>
    );
  }

  if (!buffers) {
    return <div className="text-center p-4">Loading files...</div>;
  }
  console.log("->", buffers);

  return (
    <div className="w-full p-6 flex justify-center flex-col items-center">
      <div className="flex justify-center items-center gap-2.5">
        <AddUploadPop setArrayBuffer={setFiles} name={uuidv4()} />
        <EnvEdited setEnv={setModelSetting} name={uuidv4()} />
      </div>
      <div className="flex justify-center items-center gap-2.5">
        <ColorPiker setBgs={setModelSetting} />
      </div>

      <div className="tabs tabs-lift w-full h-full">
        {buffers.map((file, i) => (
          <TabEdit
            setModel={setModelSetting}
            data={file}
            keys={(i + 1).toString()}
            key={i}
            fileName={files[i].name}
            productId={productId}
            removeFile={() => {
              setFiles((prevFiles) => {
                if (!prevFiles) return null;
                const updatedFiles = [...prevFiles];
                updatedFiles.splice(i, 1);
                return updatedFiles.length > 0 ? updatedFiles : null;
              });

              setBuffers((prevBuffers) => {
                if (!prevBuffers) return null;
                const updatedBuffers = [...prevBuffers];
                updatedBuffers.splice(i, 1);
                return updatedBuffers.length > 0 ? updatedBuffers : null;
              });
            }}
          />
        ))}
      </div>
      <div className="flex justify-end gap-3 w-full my-2.5">
        <button
          className="btn"
          onClick={() => {
            connectEveryThinks(
              {
                ...modelSetting,
                productId: productId || 0,
                bgs: modelSetting.bgs.map((bg, index) => ({
                  id: bg.id ?? index,
                })),
                env: modelSetting.env.map((env, index) => ({
                  id: env.id ?? index,
                })),
                mash: modelSetting.mash.map((mash, index) => ({
                  ...mash,
                  id: mash.id ?? index,
                  fabrics: mash.fabrics.map((fabric, fabricIndex) => ({
                    id: fabric.id ?? fabricIndex,
                  })),
                  variant: mash.variants.map((variant, variantIndex) => ({
                    ...variant,
                    id: variant.id ?? variantIndex,
                    fabrics: variant.fabrics?.map((fabric, fabricIndex) => ({
                      id: fabric.id ?? fabricIndex,
                    })),
                  })),
                })),
              },
              ""
            );
          }}
          disabled={productId === undefined}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
