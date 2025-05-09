"use client";
import { getAllProduct } from "@/api";
import { Product } from "@/types/type";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddProduct from "./_components/add_product";

const page = () => {
  const [Product, setProduct] = useState<Product[]>([]);
  const addProductRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    getAllProduct().then((data) => {
      setProduct(data.data);
    });
  }, []);
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
                  <td>{v.pdfText.slice(0, 100)}...</td>
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
