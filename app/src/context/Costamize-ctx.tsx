"use client";
import { Mash, Model, Product } from "@/types/config";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
interface Costumier {
  product: Product | null;
  variantViability:
    | {
        data: Mash;
        visible: boolean;
      }[]
    | null;
  model: { data: Model; selected: boolean }[] | null;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  mash: Mash[];
  selectModel: Model | null;
}

const CostumeCtx = createContext<Costumier | undefined>(undefined);

export const useCostumes = (): Costumier => {
  const context = useContext(CostumeCtx);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const CostumesProvider = (props: PropsWithChildren) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [model, setModel] = useState<{ data: Model; selected: boolean }[]>([]);
  const [SelectedModel, setSelectedModel] = useState<Model | null>(null);
  const [mash, setMash] = useState<Mash[]>([]);
  const [variantViability, setVariantViability] = useState<
    {
      data: Mash;
      visible: boolean;
    }[]
  >([]);
  useEffect(() => {}, [model]);

  useEffect(() => {
    if (product && product.model) {
      product.model.forEach((v, i) => {
        if (i === 1) {
          setModel((priv) => [...priv, { data: v, selected: true }]);
        } else {
          setModel((priv) => [...priv, { data: v, selected: false }]);
        }
      });
    }
    if (model) {
      const selected = model.filter((v) => v.selected)[0];
      setSelectedModel(selected ? selected.data : null);
    }
    console.log("ses", model);
  }, [product]);
  useEffect(() => {
    if (model && model.length > 0) {
      const updatedVariantViability = model
        .filter((v) => v.selected)
        .flatMap((v) =>
          v.data.mash
            .filter((mash) => mash.variants.length > 0)
            .map((mash) => ({
              data: mash,
              visible: false,
            }))
        );
      const mashV = model.filter((v) => v.selected).flatMap((v) => v.data.mash);
      setMash(mashV);
      setVariantViability(updatedVariantViability);
    }
  }, [model]);

  const value: Costumier = useMemo(
    () => ({
      product,
      variantViability,
      model,
      setProduct,
      mash,
      selectModel: SelectedModel,
    }),
    [product, model, variantViability]
  );
  console.log(value);

  return (
    <CostumeCtx.Provider value={value}>{props.children}</CostumeCtx.Provider>
  );
};
