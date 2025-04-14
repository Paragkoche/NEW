import { getModelById } from "@/api";
import CustomizePanel from "@/components/customize-panel";
import ViewThreeD from "@/components/viewThreeD";

type PageProps = {
  params: Promise<{ id: string }>;
  // searchParams?: { [key: string]: string | string[] | undefined };
};
const Page = async (props: PageProps) => {
  let id = (await props.params).id;
  const model = await getModelById(id);
  // console.log(model.data);

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
