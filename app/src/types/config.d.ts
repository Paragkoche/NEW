export interface User {
  id: number;
  username: string;
  password: string;
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
  Mash?: Mash | null; // Parent mash
  variants: Mash[]; // Child variants
  textures: Fabric[];
  modelId?: number | null;
  Model?: Model | null;
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
