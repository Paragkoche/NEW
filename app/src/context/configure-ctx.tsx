"use client";

import {
  Model,
  Product,
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

  setPdfText: Dispatch<SetStateAction<string | null>>;
  pdfText: string | null;

  setImageBank: Dispatch<SetStateAction<string | null>>;
  ImageBank: string | null;

  SetRotation: Dispatch<SetStateAction<boolean | null>>;
  rotation: boolean | null;
  selectedModel: Model | null;
  changeSelectedModel: Dispatch<SetStateAction<Model | null>>;

  selectedVariants: Mash | null;
  changeSelectedVariants: Dispatch<SetStateAction<Mash | null>>;

  fabricRageMap: Record<string, FabricRage | null>; // Keyed by Mash ID
  setFabricRageForVariant: (mashId: string, rage: FabricRage | null) => void;
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

  const [pdfText, setPdfText] = useState<string | null>(null);
  const [rotate, setRotate] = useState<boolean | null>(null);
  const [imageBank, setImageBank] = useState<string | null>(null);
  const [selectedModel, changeSelectedModel] = useState<Model | null>(null);

  const [selectedVariants, changeSelectedVariants] = useState<Mash | null>(
    null
  );
  const [fabricRageMap, setFabricRageMap] = useState<
    Record<string, FabricRage | null>
  >({});
  const [selectedFabrics, changeSelectedFabrics] = useState<
    Record<string, Fabric>
  >({});
  const canvasRef = useRef<null | HTMLCanvasElement>(null);

  const [showDimensions, setShowDimensions] = useState<boolean>(false);

  const setFabricRageForVariant = (mashId: string, rage: FabricRage | null) => {
    setFabricRageMap((prev) => ({
      ...prev,
      [mashId]: rage,
    }));
  };

  const value: ConfigType = {
    setModel,
    Models,

    selectedModel,
    changeSelectedModel,

    selectedVariants,
    changeSelectedVariants,
    fabricRageMap,
    setFabricRageForVariant,
    selectedFabrics,
    changeSelectedFabrics,
    showDimensions,
    setShowDimensions,
    canvasRef,
    pdfText,
    setPdfText,
    ImageBank: imageBank,
    setImageBank,
    SetRotation: setRotate,
    rotation: rotate,
  };

  return <ConfigCtx.Provider value={value}>{children}</ConfigCtx.Provider>;
};
