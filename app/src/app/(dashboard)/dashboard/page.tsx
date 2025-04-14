import { getModels } from "@/api";
import Card from "./_components/cards";
import Header from "./_components/header";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;
const page = async () => {
  const data = await getModels();
  // console.log(data.data);

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3">
        {data.data.models.map((v, i) => (
          <Card
            name={v.name}
            imageUrl={`${API_BASE_URL}/${v.thumbnailUrl}`}
            key={i}
            id={v.id}
          />
        ))}
      </main>
    </>
  );
};

export default page;
