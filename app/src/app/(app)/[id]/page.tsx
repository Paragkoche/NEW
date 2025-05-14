"use client";

import { use, useEffect, useState } from "react";
import { addProductViewCount, getAllProduct, getModelById } from "@/api";
import CustomizePanel from "@/components/customize-panel";
import ViewThreeD from "@/components/viewThreeD";
import { Product, Product as ProductType } from "@/types/type";
import MoreOptions from "@/components/More-options";
import { FullscreenIcon } from "lucide-react";
import FullscreenToggle from "@/components/fullsceen";

type PageProps = {
  params: Promise<{ id: string }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};
const Page = ({ params }: PageProps) => {
  const { id } = use(params);

  const [data, setData] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      getAllProduct().then(({ data }) => {
        data.map((v) => {
          if (v.id == Number(id)) setData(v);
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }
  console.log(":)>", data);

  return (
    <main className="flex justify-center items-center w-screen h-screen relative overflow-hidden">
      <div className="w-full h-full">
        <ViewThreeD {...data} />
      </div>
      <h1 className="fixed top-2 left-2 text-4xl select-none">
        {data.name} <br />
        <span className="text-gray-900 text-3xl">Virtual configurator</span>
      </h1>

      <CustomizePanel />
      <div className="fixed top-2 right-2 flex items-center">
        <FullscreenToggle />
        <MoreOptions />
      </div>
    </main>
  );
};

export default Page;
