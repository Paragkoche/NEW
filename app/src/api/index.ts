"use clint";
import { Fabric, FabricRage, Model, Product } from "@/types/type";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;
const client = axios.create({
  baseURL: API_BASE_URL + "/",
});

export const getModelById = async (id: string) =>
  await client.get<Model[]>(`/product/model/get-model/${id}`);

export const getAllProduct = async () =>
  await client.get<Product[]>(`/product/get-all`);

export const getAllFabricRage = async () =>
  await client.get<FabricRage[]>("/product/fabric-rage");
export const getAllFabric = async () =>
  await client.get<Fabric[]>("/product/fabric/get-all-fabric");

export const PostFabricRage = async (
  token: string,
  data: {
    name: string;
  }
) => {
  console.log(token);
  return await client.post<FabricRage>("/product/fabric-rage/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getFabricById = async (id: number) =>
  await client.get<Fabric>("/product/fabric-rage/get-fabric-id/" + id);

export const getFabricRageById = async (id: number) =>
  await client.get<FabricRage>("/product/fabric/get-fabric-by-id/" + id);

export const updateFabricRageById = async (
  token: string,
  id: number,
  data: {
    name: string;
  }
) =>
  await client.put<FabricRage>(
    "/product/fabric-rage/update-fabric-by-id/" + id,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteFabricRageById = async (token: string, id: number) =>
  await client.delete<undefined>(
    "/product/fabric-rage/delete-fabric-by-id/" + id,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getAllModel = async () =>
  await client.get<Model[]>("/product/model/get-all-model");
