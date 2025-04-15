"use client";

import { useEffect, useState } from "react";
import { getModels } from "@/api";
import Card from "./_components/Card";
import { Product } from "@/types/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const Page = () => {
  const [columns, setColumns] = useState<
    [Product[], Product[], Product[], Product[]]
  >([[], [], [], []]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getModels();

      // Split into 4 columns
      const newColumns: [Product[], Product[], Product[], Product[]] = [
        [],
        [],
        [],
        [],
      ];
      data.data.models.forEach((model, idx) => {
        newColumns[idx % 4].push(model);
      });

      setColumns(newColumns);
    };

    fetchData();
  }, []);

  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="grid gap-16">
          {column.map((model) => (
            <Card
              key={model.id}
              name={model.name}
              id={model.id}
              imageUrl={`${API_BASE_URL}/${model.thumbnailUrl}`}
            />
          ))}
        </div>
      ))}
    </main>
  );
};

export default Page;
