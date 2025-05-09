"use client";

import { useParams, usePathname } from "next/navigation";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type HeaderContextType = {
  headerName: string;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider = (props: PropsWithChildren) => {
  const headerName = usePathname();
  return (
    <HeaderContext.Provider
      value={{
        headerName: headerName.split("/").at(-1)!,
      }}
    >
      {props.children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
