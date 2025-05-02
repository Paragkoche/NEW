"use client";

import {
  Env,
  Model,
  Product,
  Bgs,
  Fabric,
  Mash,
  MashVariants,
  FabricRage,
} from "@/types/type";
import { fabrics } from "@/types/upload";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ConfigType {
  Models: Model[] | null;
  setModel: Dispatch<SetStateAction<Model[] | null>>;
  envs: Env[] | null;
  setBgs: Dispatch<SetStateAction<Bgs[] | null>>;
  bgs: Bgs[] | null;
  setEnvs: Dispatch<SetStateAction<Env[] | null>>;
  selectedModel: Model | null;
  changeSelectedModel: Dispatch<SetStateAction<Model | null>>;
  selectedBg: Bgs | null;
  changeSelectedBg: Dispatch<SetStateAction<Bgs | null>>;
  selectedEnv: Env | null;
  changeSelectedEnv: Dispatch<SetStateAction<Env | null>>;
  selectedVariants: Mash | null;
  changeSelectedVariants: Dispatch<SetStateAction<Mash | null>>;

  fabricRageMap: Record<number, FabricRage | null>; // Keyed by Mash ID
  setFabricRageForVariant: (mashId: number, rage: FabricRage | null) => void;
  selectedFabrics: Record<string, Fabric>;
  changeSelectedFabrics: Dispatch<SetStateAction<Record<string, Fabric>>>;
  showDimensions: boolean;
  setShowDimensions: Dispatch<SetStateAction<boolean>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
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
  const [Models, setModel] = useState<Model[] | null>(null);
  const [envs, setEnvs] = useState<Env[] | null>(null);
  const [bgs, setBgs] = useState<Bgs[] | null>(null);
  const [selectedModel, changeSelectedModel] = useState<Model | null>(null);
  const [selectedBg, changeSelectedBg] = useState<Bgs | null>(null);
  const [selectedEnv, changeSelectedEnv] = useState<Env | null>(null);
  const [selectedVariants, changeSelectedVariants] = useState<Mash | null>(
    null
  );
  const [fabricRageMap, setFabricRageMap] = useState<
    Record<number, FabricRage | null>
  >({});
  const [selectedFabrics, changeSelectedFabrics] = useState<
    Record<string, Fabric>
  >({});
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  const [showDimensions, setShowDimensions] = useState<boolean>(false);

  const setFabricRageForVariant = (mashId: number, rage: FabricRage | null) => {
    setFabricRageMap((prev) => ({
      ...prev,
      [mashId]: rage,
    }));
  };

  const value: ConfigType = {
    bgs,
    setBgs,
    setEnvs,
    setModel,
    Models,
    envs,
    selectedModel,
    changeSelectedModel,
    selectedBg,
    changeSelectedBg,
    selectedEnv,
    changeSelectedEnv,
    selectedVariants,
    changeSelectedVariants,
    fabricRageMap,
    setFabricRageForVariant,
    selectedFabrics,
    changeSelectedFabrics,
    showDimensions,
    setShowDimensions,
    canvasRef,
  };

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>;
};
