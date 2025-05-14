export class Users {
  id: number;
  username: string;
  password: string;
}
export class Dimensions {
  id: number;

  label: string;

  x: number;

  y: number;

  z: number;

  end_x: number;

  end_y: number;

  end_z: number;
}
export class Fabric {
  id: number;

  name: string;

  size: number;

  url?: string;

  thumbnailUrl?: string;
  fabricRage?: FabricRage;
}
export class FabricRage {
  id: number;

  name: string;

  fabric: Fabric[];
}

export class MashVariants {
  id: number;

  name: string;

  mash: Mash[];
}
export class Mash {
  id: number;
  itOptional: boolean;
  textureEnable: boolean;
  thumbnailUrl?: string | null;
  url?: string | null;
  name: string;
  mashName: string;
  fabricRange: FabricRage[];
  mashVariants?: MashVariants;
}
export class Model {
  id: number;
  viewCount: number;
  name: string;
  isDefault: boolean;
  shadow: boolean;
  autoRotate: boolean;
  RotationSpeed: number;
  url: string;
  thumbnailUrl?: string | null;
  mash: Mash[];
  imageBank: string;

  dimensions: Dimensions[];
}

export class Product {
  id: number;
  name: string;
  thumbnailUrl?: string;
  pdfText: string;

  model: Model[];
}
