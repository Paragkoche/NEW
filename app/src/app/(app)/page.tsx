import { getAllProduct } from "@/api";
import Card from "./_components/Card";
import { Product as ProductType } from "@/types/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API;

const Page = async () => {
  const data = await getAllProduct();

  // Split into 4 columns
  const columns: Array<[ProductType?]> = [[], [], [], []];
  data.data.forEach((model, idx) => {
    columns[idx % 4].push(model);
  });

  return (
    <main className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className="grid gap-4">
          {column.map(
            (model, i) =>
              model && (
                <Card
                  key={model.id}
                  name={model.name}
                  id={model.id}
                  imageUrl={`${API_BASE_URL}/${model.thumbnailUrl}`}
                />
              )
          )}
        </div>
      ))}
    </main>
  );
};
export default Page;
