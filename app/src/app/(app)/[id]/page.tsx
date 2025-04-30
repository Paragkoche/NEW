"use client";

import { use, useEffect, useState } from "react";
import { getModelById } from "@/api";
import CustomizePanel from "@/components/customize-panel";
import ViewThreeD from "@/components/viewThreeD";
import { Product as ProductType } from "@/types/type";
import { product } from "@/data/product";

type PageProps = {
  params: Promise<{ id: string }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};
const Page = ({ params }: PageProps) => {
  const { id } = use(params);

  const [data, setData] = useState<{ models: ProductType } | null>(null);

  useEffect(() => {
    if (id)
      setData({
        models: product,
      });
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex justify-center items-center w-screen h-screen relative overflow-hidden">
      <div className="w-full h-full">
        <ViewThreeD {...data.models} />
      </div>
      <h1 className="fixed top-2 left-2 text-4xl select-none">
        {data.models.name} <br />
        <span className="text-zinc-400 text-2xl">Virtual configurator</span>
      </h1>
      <CustomizePanel />
    </main>
  );
};

export default Page;
