"use client";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddFabric from "./_components/addFabric";
import { deleteFabricById, getAllFabric } from "@/api";
import { Fabric } from "@/types/type";
import UpdateFabric from "./_components/updateFabric";
import ConformBox from "./_components/conform";
import { useAuth } from "../../_ctx/auth.ctx";
const API_URL = process.env.NEXT_PUBLIC_API;
const page = () => {
  const addFabricRef = useRef<HTMLDialogElement>(null);
  const [fabric, setFabric] = useState<Fabric[]>([]);
  const UpdateFabricRef = useRef<HTMLDialogElement>(null);
  const deleteFabricRef = useRef<HTMLDialogElement>(null);
  const [fabricRangeEditHeader, setFabricRangeEditHeader] =
    useState<string>("");
  const [fabricEditId, setFabricEditId] = useState<string>("");
  const [fabricDeleteFun, setFabricDeleteFun] = useState<(() => void) | null>(
    null
  );
  const { token } = useAuth();
  useEffect(() => {
    getAllFabric().then((data) => {
      setFabric(data.data);
    });
  }, []);
  return (
    <div className="card  bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex justify-between items-center w-full">
          <p>Fabrics</p>
          <div className="flex justify-between gap-5 items-center">
            <button
              className="btn"
              onClick={() => {
                if (addFabricRef.current) addFabricRef.current.showModal();
              }}
            >
              <Plus />
              Fabric
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>sr no</th>
                <th>thumbnail</th>
                <th>name</th>
                <th>size</th>
                <th>Range</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {fabric.map((v, i) => (
                <tr key={i}>
                  <td> {i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={`${API_URL}${v.thumbnailUrl}`}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{v.name}</td>
                  <td>{v.size}</td>
                  <td>{v.fabricRage?.name}</td>
                  <td>
                    <div className="flex gap-1.5">
                      <button
                        className="btn  btn-sm"
                        onClick={() => {
                          setFabricEditId(v.id);

                          if (UpdateFabricRef.current)
                            UpdateFabricRef.current.showModal();
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn  btn-sm btn-error"
                        onClick={() => {
                          setFabricRangeEditHeader("Fabric");

                          setFabricDeleteFun(() => async () => {
                            try {
                              if (!token) {
                                throw new Error("token not found");
                              }
                              // Call your API to update the fabric range

                              await deleteFabricById(token, v.id);
                              window.location.reload();
                              // Close dialog after successful update
                              (
                                deleteFabricRef as React.RefObject<HTMLDialogElement>
                              )?.current?.close();
                            } catch (error) {
                              console.error(
                                "Failed to update fabric range:",
                                error
                              );
                            }
                          });
                          if (deleteFabricRef.current) {
                            deleteFabricRef.current.showModal();
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
          </table>
        </div>
      </div>

      <AddFabric ref={addFabricRef} />
      <UpdateFabric id={fabricEditId} ref={UpdateFabricRef} />
      <ConformBox
        okFun={fabricDeleteFun!}
        ref={deleteFabricRef}
        text={fabricRangeEditHeader}
      />
    </div>
  );
};

export default page;
