export interface modelUploadState {
  productId?: number;
  modelName: string;
  shadow: boolean;
  isDefault: boolean;
  autoRotate: boolean;
  rotationSpeed: number;
  bgs: { color: string; id?: number }[];
  env: {
    name: string;
    file: ArrayBuffer;
    thumbnailUrl: ArrayBuffer;
    id?: number;
  }[];
  mash: Mash[];
}
interface Mash {
  id?: number;
  name: string;

  fabrics: fabrics[];
  variants: Variants[];
  itOptional: boolean;
  textureEnable: boolean;
}
interface fabrics {
  id?: number;
  file: ArrayBuffer;
  thumbnail: ArrayBuffer;
  name: string;
}

interface Variants {
  id?: number;
  file: ArrayBuffer | null;
  thumbnail: ArrayBuffer | null;
  name: string;
  itOptional: boolean;
  textureEnable: boolean;
  fabrics?: fabrics[];
}
