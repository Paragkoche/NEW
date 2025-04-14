"use client";
import { useRouter } from "next/navigation";

const Card = (props: { name: string; imageUrl: string; id: number }) => {
  const router = useRouter();
  return (
    <div
      className="card bg-base-100 w-96 shadow-sm cursor-pointer"
      onClick={() => router.push("/" + props.id)}
    >
      <figure>
        <img src={props.imageUrl} alt="Shoes" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{props.name}</h2>
      </div>
    </div>
  );
};

export default Card;
