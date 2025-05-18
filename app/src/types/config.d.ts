export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  thumbnailUrl?: string | null;
  bgs: Bgs[];
  Env: Env[];
  model: Model[];
}

export interface Bgs {
  id: string;
  color: string;
  productId?: number | null;
  Product?: Product | null;
}

export interface Model {
  id: string;
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
  id: string;
  name: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  productId?: number | null;
  Product?: Product | null;
}

export interface Mash {
  id: string;
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
  id: string;
  name: string;
  url?: string | null;
  thumbnailUrl?: string | null;
  size: number;
  mashId?: number | null;
  Mash?: Mash | null;
}
