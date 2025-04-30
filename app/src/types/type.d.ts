export interface User {
  id: number;
  username: string;
  password: string;
}

export interface FabricRage {
  id: number;
  name: string;
  fabrics: Fabric[];
}
export interface Product {
  id: number;
  name: string;
  thumbnailUrl?: string | null;
  bgs: Bgs[];
  Env: Env[];
  model: Model[];
}

export interface Bgs {
  id: number;
  color: string;
  productId?: number | null;
  Product?: Product | null;
}

export interface Model {
  id: number;
  name: string;
  isDefault: boolean;
  shadow: boolean;
  autoRotate: boolean;
  RotationSpeed: number;
  thumbnailUrl?: string | null;
  url?: string | null;
  productId?: number | null;
  Product?: Product | null;
  mash: Mash[];
}

export interface Env {
  id: number;
  name: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  productId?: number | null;
  Product?: Product | null;
}

export interface Mash {
  id: number;
  itOptional: boolean;
  textureEnable: boolean;
  thumbnailUrl?: string | null;
  url?: string | null;
  mashId?: number | null;
  name: string;
  mashName: string;
  Mash?: Mash | null; // Parent mash
  variants?: MashVariants; // Child variants
  textures: FabricRage[];
  modelId?: number | null;
  Model?: Model | null;
}

export interface MashVariants {
  id: number;
  name: string;
  mash: Mash[];
}

export interface Fabric {
  id: number;
  name: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  size: number;
  mashId?: number | null;
  Mash?: Mash | null;
}
