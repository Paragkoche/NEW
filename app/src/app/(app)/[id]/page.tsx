"use client";

import { useEffect, useState } from "react";
import { getModelById } from "@/api";
import CustomizePanel from "@/components/customize-panel";
import ViewThreeD from "@/components/viewThreeD";

type PageProps = {
  params: { id: string };
};

const Page = ({ params }: PageProps) => {
  const [model, setModel] = useState<any>(null);

  useEffect(() => {
    const fetchModel = async () => {
      const data = await getModelById(params.id);
      setModel(data);
    };

    fetchModel();
  }, [params.id]);

  if (!model) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex justify-center items-center w-screen h-screen relative overflow-hidden">
      <div className="w-full h-full">
        <ViewThreeD {...model.data.models} />
      </div>
      <CustomizePanel />
    </main>
  );
};

export default Page;
