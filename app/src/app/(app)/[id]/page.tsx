"use client";

import { use, useEffect, useState } from "react";
import { getModelById } from "@/api";
import CustomizePanel from "@/components/customize-panel";
import ViewThreeD from "@/components/viewThreeD";
import { Product } from "@/types/config";

type PageProps = {
  params: Promise<{ id: string }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};
const Page = ({ params }: PageProps) => {
  const { id } = use(params);

  const [data, setData] = useState<{ models: Product } | null>(null);

  useEffect(() => {
    if (id) getModelById(id).then((data) => setData(data.data));
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
      <CustomizePanel />
    </main>
  );
};

export default Page;
