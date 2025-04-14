"use clint";
import { Model, Product } from "@/types/config";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API;
const client = axios.create({
  baseURL: API_BASE_URL + "/api",
});

export const getModelById = async (id: string) =>
  await client.get<{ models: Product }>(`/model/${id}`);

export const getModels = async () =>
  await client.get<{ models: Product[] }>(`/model`);

export const addProduct = async (data: { name: string }, token: string) =>
  await client.post("/model/product-data", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addModel = async (
  data: {
    name: string;
    isDefault: boolean;
    shadow: boolean;
    autoRotate: boolean;
    RotationSpeed: number;
    productId: number;
  },
  token: string
) =>
  await client.post("/model/add-model-data", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addFabric = async (
  data: {
    name: string;
    size: number;
  },
  token: string
) =>
  await client.post("/model/add-fabric-data", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addVariant = async (
  data: {
    itOptional: boolean;
    textureEnable: boolean;
    fabricId?: number[];
    name: string;
  },
  token: string
) =>
  await client.post("/model/add-variant-data", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addBg = async (data: { color: string }[], token: string) =>
  await client.post("/model/add-bg", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const addEnv = async (data: { name: string }, token: string) =>
  await client.post("/model/env-data", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const connectEveryThinks = async (
  data: {
    bgs: {
      id: number;
    }[];
    productId: number;
    env: {
      id: number;
    }[];
    mash: {
      id: number;
      fabrics: {
        id: number;
      }[];
      variant: {
        id: number;
        fabrics?:
          | {
              id: number;
            }[]
          | undefined;
      }[];
    }[];
  },
  token: string
) =>
  await client.post("/model/connect-every-thinks/" + data.productId, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const connectModel = async (
  data: {
    modelId: number;
    productId: number;

    mash: {
      id: number;
      fabrics: {
        id: number;
      }[];
      variant: {
        id: number;
        fabrics?:
          | {
              id: number;
            }[]
          | undefined;
      }[];
    }[];
  },
  token: string
) =>
  await client.post(
    "/model/add-model-and-connect-variants-n-fabric/" + data.modelId,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
