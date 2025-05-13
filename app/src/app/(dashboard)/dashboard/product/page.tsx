"use client";
import { deleteFabricRageById, deleteProductById, getAllProduct } from "@/api";
import { Product } from "@/types/type";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddProduct from "./_components/add_product";
import { useAuth } from "../../_ctx/auth.ctx";
import ConformBox from "../fabric/_components/conform";
import UpdateProduct from "./_components/update_product";
const API_URL = process.env.NEXT_PUBLIC_API;

const page = () => {
  const [Product, setProduct] = useState<Product[]>([]);
  const addProductRef = useRef<HTMLDialogElement>(null);
  const UpdateFabricRangeRef = useRef<HTMLDialogElement>(null);
  const deleteFabricRangeRef = useRef<HTMLDialogElement>(null);
  const [fabricRangeEditId, setFabricRangeEditId] = useState<number>(0);
  const [fabricRangeEditHeader, setFabricRangeEditHeader] =
    useState<string>("");
  const [fabricRangeDeleteFun, setFabricRangeDeleteFun] = useState<
    (() => void) | null
  >(null);
  useEffect(() => {
    getAllProduct().then((data) => {
      setProduct(data.data);
    });
  }, []);
  const { token } = useAuth();
  return (
    <div className="card  bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex justify-between items-center w-full">
          <p>Product</p>
          <div className="flex justify-between gap-5 items-center">
            <button
              className="btn"
              onClick={() => {
                if (addProductRef.current) addProductRef.current.showModal();
              }}
            >
              <Plus />
              Product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>pdf content</th>

                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {Product.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
                  <td>
                    <a
                      href={`${API_URL}${v.pdfText}`}
                      className="underline hover:text-blue-400"
                    >
                      PDF
                    </a>
                  </td>
                  <th>
                    <div className="flex gap-1.5">
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setFabricRangeEditId(v.id);
                          if (UpdateFabricRangeRef.current)
                            UpdateFabricRangeRef.current.showModal();
                          console.log(v.id);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => {
                          setFabricRangeEditHeader("Product");

                          setFabricRangeDeleteFun(() => async () => {
                            try {
                              if (!token) {
                                throw new Error("token not found");
                              }
                              // Call your API to update the fabric range

                              await deleteProductById(token, v.id);
                              window.location.reload();
                              // Close dialog after successful update
                              (
                                deleteFabricRangeRef as React.RefObject<HTMLDialogElement>
                              )?.current?.close();
                            } catch (error) {
                              console.error("Failed to delete Product:", error);
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
                  </th>
                </tr>
              ))}
              {/* row 1 */}
            </tbody>
            {/* foot */}
          </table>
        </div>
      </div>

      <AddProduct ref={addProductRef} />
      <ConformBox
        ref={deleteFabricRangeRef}
        okFun={fabricRangeDeleteFun!}
        text={fabricRangeEditHeader}
      />
      <UpdateProduct ref={UpdateFabricRangeRef} id={fabricRangeEditId} />
    </div>
  );
};

export default page;
