"use client";
import { useRouter } from "next/navigation";

const Card = (props: { name: string; imageUrl: string; id: number }) => {
  const router = useRouter();

  return (
    <div
      className="cursor-pointer transition-transform "
      onClick={() => router.push("/" + props.id)}
    >
      <img
        src={props.imageUrl}
        alt={props.name}
        className="h-auto max-w-full rounded-lg object-cover"
      />
      <div className="mt-2 px-1">
        <h2 className="text-sm font-semibold">{props.name}</h2>
      </div>
    </div>
  );
};

export default Card;
