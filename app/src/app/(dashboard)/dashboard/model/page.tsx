"use client";
import { getAllModel, getAllProduct } from "@/api";
import { Model } from "@/types/type";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddProduct from "./_components/add_model";
import { useRouter } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API;

const page = () => {
  const [Product, setProduct] = useState<Model[]>([]);
  const addProductRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    getAllModel().then((data) => {
      setProduct(data.data);
    });
  }, []);
  const router = useRouter();
  return (
    <div className="card  bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="card-title flex justify-between items-center w-full">
          <p>Product</p>
          <div className="flex justify-between gap-5 items-center">
            <button
              className="btn"
              onClick={() => {
                router.push("/dashboard/model/add");
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
                {Product[0] &&
                  Object.keys(Product[0]).map((v, i) => <th key={i}>{v}</th>)}
                {/* <th>Name</th>
                <th>pdf content</th>

                <th>action</th> */}
              </tr>
            </thead>
            <tbody>
              {Product.map((v, i) => (
                <tr key={i}>
                  <td>{v.name}</td>
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
                  <th>
                    <button className="btn">
                      <Edit2 size={16} />
                      Update
                    </button>
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
    </div>
  );
};

export default page;
