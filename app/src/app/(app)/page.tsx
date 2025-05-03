"use client";

import { useEffect, useState } from "react";
import { getModels } from "@/api";
import Card from "./_components/Card";
import { Product as ProductType } from "@/types/type";
import { ProductGlary } from "@/data/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const Page = () => {
  const [columns, setColumns] = useState<Array<ProductType>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = ProductGlary;

      setColumns(data);
    };

    fetchData();
  }, []);

  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="grid gap-16">
          {column.model.map((model) => {
            return (
              <Card
                key={model.id}
                name={model.name}
                id={model.id}
                imageUrl={`/${model.thumbnailUrl}`}
              />
            );
          })}
        </div>
      ))}
    </main>
  );
};

export default Page;
