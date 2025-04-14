"use client";

import { Env, Model, Product, Bgs, Fabric, Mash } from "@/types/config";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface ConfigType {
  Config: Product | undefined;
  setConfig: Dispatch<SetStateAction<Product | undefined>>;
  model: Model | undefined;
  setModel: Dispatch<SetStateAction<Model | undefined>>;
  envSelect: Env | undefined;
  setEnv: Dispatch<SetStateAction<Env | undefined>>;
  bg: Bgs | undefined;
  setBg: Dispatch<SetStateAction<Bgs | undefined>>;
  selectedVariants: Record<string, string>; // { mashName: variantUrl }
  setSelectedVariants: Dispatch<SetStateAction<Record<string, string>>>;
  selectedFabric: Fabric | null;
  setFabric: (fabricUrl: string) => void;
  resetFabrics: () => void;
}

const ConfigCtx = createContext<ConfigType | undefined>(undefined);

export const useConfig = (): ConfigType => {
  const context = useContext(ConfigCtx);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider = ({ children }: PropsWithChildren) => {
  const [config, setConfig] = useState<Product | undefined>();
  const [selectedModel, setSelectedModel] = useState<Model>();
  const [selectedEnv, setSelectedEnv] = useState<Env>();
  const [selectedBg, setSelectedBg] = useState<Bgs>();
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);

  const getAllFabrics = (): Fabric[] => {
    let fabrics: Fabric[] = [];
    if (selectedModel?.mash) {
      selectedModel.mash.forEach((mash: Mash) => {
        fabrics = [...fabrics, ...mash.textures];
      });
    }
    return fabrics;
  };

  const findFabricByUrl = (fabricUrl: string): Fabric | null => {
    const allFabrics = getAllFabrics();
    return allFabrics.find((fabric) => fabric.url === fabricUrl) || null;
  };

  const setFabric = (fabricUrl: string) => {
    const found = findFabricByUrl(fabricUrl);
    setSelectedFabric(found);
  };

  const resetFabrics = () => {
    setSelectedFabric(null);
  };

  useEffect(() => {
    if (config && !selectedModel) {
      setSelectedModel(
        config.model.find((v) => v.isDefault) || config.model[0]
      );
    }

    if (config && !selectedEnv && config.Env.length > 0) {
      setSelectedEnv(config.Env[0]);
    }
  }, [config]);

  return (
    <ConfigCtx.Provider
      value={{
        Config: config,
        setConfig,
        model: selectedModel,
        setModel: setSelectedModel,
        envSelect: selectedEnv,
        setEnv: setSelectedEnv,
        bg: selectedBg,
        setBg: setSelectedBg,
        selectedVariants,
        setSelectedVariants,
        selectedFabric,
        setFabric,
        resetFabrics,
      }}
    >
      {children}
    </ConfigCtx.Provider>
  );
};
