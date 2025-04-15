"use client";

import { useEffect, useState } from "react";
import { getModels } from "@/api";
import Card from "./_components/cards";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const Page = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getModels();
      setData(response.data);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
      {data.models.map((v: any, i: number) => (
        <Card
          name={v.name}
          imageUrl={`${API_BASE_URL}/${v.thumbnailUrl}`}
          key={i}
          id={v.id}
        />
      ))}
    </main>
  );
};

export default Page;
