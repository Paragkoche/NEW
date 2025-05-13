"use client";
import { getAllModel, getAllProduct } from "@/api";
import { Model } from "@/types/type";
import { Edit2, Pen, Plus, Trash, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddProduct from "./_components/add_model";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
          <p>Model</p>
          <div className="flex justify-between gap-5 items-center">
            <button
              className="btn"
              onClick={() => {
                router.push("/dashboard/model/add");
              }}
            >
              <Plus />
              Model
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

                 */}
                {Product[0] && <th>action</th>}
              </tr>
            </thead>
            <tbody>
              {Product.map((vv: any, index) => (
                <tr key={index}>
                  {Object.keys(Product[0]).map((v: any, i) => (
                    <td key={i}>
                      {v == "thumbnailUrl" ? (
                        vv.thumbnailUrl ? (
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle h-12 w-12">
                                <img
                                  src={`${API_URL}${vv.thumbnailUrl}`}
                                  alt="Avatar Tailwind CSS Component"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>No thumbnail</p>
                        )
                      ) : v == "imageBank" ? (
                        <a
                          href={`${API_URL}${vv[v]}`}
                          className="underline hover:text-blue-400"
                        >
                          Zip file
                        </a>
                      ) : v == "url" ? (
                        <a
                          href={`${API_URL}${vv[v]}`}
                          className="underline hover:text-blue-400"
                        >
                          Model
                        </a>
                      ) : v == "id" ? (
                        String(index + 1)
                      ) : (
                        String(vv[v])
                      )}
                    </td>
                  ))}

                  <th>
                    <div className="flex gap-1.5">
                      <Link href={"/dashboard/model/update/" + vv.id}>
                        <button className="btn">
                          <Pen size={16} />
                        </button>
                      </Link>
                      <button className="btn btn-error">
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
    </div>
  );
};

export default page;
