"use client";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddFabricRange from "../_components/addFabricRange";
import { FabricRage } from "@/types/type";
import { deleteFabricRageById, getAllFabricRage } from "@/api";
import UpdateFabricRange from "../_components/updateFabricRange";
import ConformBox from "../_components/conform";
import { useAuth } from "@/app/(dashboard)/_ctx/auth.ctx";
const page = () => {
  const addFabricRangeRef = useRef<HTMLDialogElement>(null);
  const UpdateFabricRangeRef = useRef<HTMLDialogElement>(null);
  const deleteFabricRangeRef = useRef<HTMLDialogElement>(null);
  const [fabricRange, setFabricRange] = useState<FabricRage[]>([]);
  const [fabricRangeEditId, setFabricRangeEditId] = useState<number>(0);
  const [fabricRangeEditHeader, setFabricRangeEditHeader] =
    useState<string>("");
  const [fabricRangeDeleteFun, setFabricRangeDeleteFun] = useState<
    (() => void) | null
  >(null);

  const { token } = useAuth();
  useEffect(() => {
    getAllFabricRage().then((data) => {
      setFabricRange(data.data);
    });
  }, []);

  return (
    <div className="card  bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex justify-between items-center w-full">
          <p>Fabrics Range</p>
          <div className="flex justify-between gap-5 items-center">
            <button
              className="btn"
              onClick={() => {
                if (addFabricRangeRef.current)
                  addFabricRangeRef.current.showModal();
              }}
            >
              <Plus />
              Fabric Range
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Sr no</th>
                <th>Name</th>
                <th>Fabric count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {fabricRange.map((v, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{v.name}</td>
                  <td>{v.fabric.length}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setFabricRangeEditHeader("Fabric range");
                          setFabricRangeEditId(v.id);
                          if (UpdateFabricRangeRef.current)
                            UpdateFabricRangeRef.current.showModal();
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          setFabricRangeDeleteFun(() => async () => {
                            try {
                              if (!token) {
                                throw new Error("token not found");
                              }
                              // Call your API to update the fabric range

                              await deleteFabricRageById(token, v.id);
                              window.location.reload();
                              // Close dialog after successful update
                              (
                                deleteFabricRangeRef as React.RefObject<HTMLDialogElement>
                              )?.current?.close();
                            } catch (error) {
                              console.error(
                                "Failed to update fabric range:",
                                error
                              );
                            }
                          });
                          if (deleteFabricRangeRef.current) {
                            deleteFabricRangeRef.current.showModal();
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
      <AddFabricRange ref={addFabricRangeRef} />
      <UpdateFabricRange id={fabricRangeEditId} ref={UpdateFabricRangeRef} />
      <ConformBox
        okFun={fabricRangeDeleteFun!}
        ref={deleteFabricRangeRef}
        text={fabricRangeEditHeader}
      />
    </div>
  );
};

export default page;
