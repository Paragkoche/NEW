import {
  Bgs,
  Env as EnvType,
  FabricRage,
  Product as ProductType,
} from "@/types/type";

export const bgs: Bgs[] = [
  {
    color: "#FFFFFF",
    id: 1,
  },
  {
    color: "#000000",
    id: 2,
  },
];
export const Env: EnvType[] = [];
export const fabricRage: FabricRage[] = [
  {
    name: "Bentley",
    fabrics: [
      {
        id: 1,
        name: "917",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-917.jpg",
      },
      {
        id: 2,
        name: "919",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-919.jpg",
      },
      {
        id: 3,
        name: "923",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-923.jpg",
      },
      {
        id: 4,
        name: "929",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-929.jpg",
      },
      {
        id: 5,
        name: "935",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-935.jpg",
      },
      {
        id: 6,
        name: "941",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-941.jpg",
      },
      {
        id: 7,
        name: "944",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-944.jpg",
      },
      {
        id: 8,
        name: "946",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-946.jpg",
      },
      {
        id: 9,
        name: "901",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-901.jpg",
      },
      {
        id: 10,
        name: "902",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-902.jpg",
      },
      {
        id: 11,
        name: "905",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-905.jpg",
      },
      {
        id: 12,
        name: "909",
        size: 20,
        url: "BENTLEY FABRIC RANGE/BENTLEY-909.jpg",
      },
    ],
    id: 1,
  },
  {
    name: "Jaguar",
    fabrics: [
      {
        id: 1,
        name: "101",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-101.jpg",
      },
      {
        id: 2,
        name: "102",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-102.jpg",
      },
      {
        id: 3,
        name: "103",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-103.jpg",
      },
      {
        id: 4,
        name: "104",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-104.jpg",
      },
      {
        id: 5,
        name: "105",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-105.jpg",
      },
      {
        id: 6,
        name: "106",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-106.jpg",
      },
      {
        id: 7,
        name: "107",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-107.jpg",
      },
      {
        id: 8,
        name: "108",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-108.jpg",
      },
      {
        id: 9,
        name: "109",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-109.jpg",
      },
      {
        id: 10,
        name: "110",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-110.jpg",
      },
      {
        id: 11,
        name: "111",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-111.jpg",
      },
      {
        id: 12,
        name: "112",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-112.jpg",
      },
      {
        id: 13,
        name: "113",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-113.jpg",
      },
      {
        id: 14,
        name: "114",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-114.jpg",
      },
      {
        id: 15,
        name: "115",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-115.jpg",
      },

      {
        id: 16,
        name: "116",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-116.jpg",
      },
      {
        id: 17,
        name: "117",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-117.jpg",
      },
      {
        id: 18,
        name: "118",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-118.jpg",
      },
      {
        id: 19,
        name: "119",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-119.jpg",
      },
      {
        id: 20,
        name: "120",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-120.jpg",
      },
      {
        id: 21,
        name: "121",
        size: 20,
        url: "JAGUAR FABRIC RANGE/JAGUAR-121.jpg",
      },
    ],
    id: 2,
  },
  {
    name: "Elegant",
    fabrics: [...new Array(18)].map((v, i) => ({
      id: i + 1,
      name: "EG-" + (i + 1 < 10 ? `0${i + 1}` : i + 1),
      size: 20,
      url: `ELEGANT FABRIC RANGE/EG-${i + 1 < 10 ? `0${i + 1}` : i + 1}.jpg`,
    })),
    id: 3,
  },
];

export const product: ProductType = {
  id: 1,
  name: "Queen Arm Chair",
  bgs,
  Env: Env,
  model: [
    {
      autoRotate: true,
      id: 1,
      isDefault: true,
      RotationSpeed: 0.25,
      shadow: true,
      thumbnailUrl: "queen_arm_chair.jpg",
      name: "Queen Arm Chair",
      url: "Queen_Chair.glb",
      mash: [
        {
          id: 1,
          itOptional: false,
          textureEnable: true,
          thumbnailUrl: null,
          name: "Inner Face Fabric/Leatherette Rage Option",
          mashName: "Fabric001_2",
          url: null,
          textures: fabricRage,
        },
        {
          id: 2,
          itOptional: false,
          textureEnable: true,
          thumbnailUrl: null,
          name: "Outer Face Fabric/Leatherette Rage Option",
          mashName: "Fabric001_1",
          url: null,
          textures: fabricRage,
        },
        {
          id: 3,
          itOptional: false,
          textureEnable: false,
          thumbnailUrl: null,
          name: "Lag",
          mashName: "R13_Leg",
          url: null,
          variants: {
            id: 1,
            name: "Legs Options",
            mash: [
              {
                id: 1,
                itOptional: false,
                textureEnable: false,
                thumbnailUrl:
                  "uploads/variant_thumbnail_D9 lag-1744866199532-189103975.png",
                name: "D9 lag",
                mashName: "R13_Leg",
                url: "Queen_Chair_D9_Leg.glb",
                mashId: 7,
                modelId: null,
                textures: [],
              },
              {
                id: 2,
                itOptional: false,
                textureEnable: false,
                thumbnailUrl:
                  "uploads/variant_thumbnail_L21-1744866199531-190519384.png",
                name: "L21",
                mashName: "R13_Leg",
                url: "Queen_Chair_L21_Leg.glb",
                mashId: 7,
                modelId: null,
                textures: [],
              },
              {
                id: 3,
                itOptional: false,
                textureEnable: false,
                thumbnailUrl:
                  "uploads/variant_thumbnail_L30-1744866199547-763763638.png",
                name: "L30",
                mashName: "R13_Leg",
                url: "Queen_Chair_L30_Leg.glb",
                mashId: 7,
                modelId: null,
                textures: [],
              },
            ],
          },
          textures: [],
        },
      ],
    },
  ],
};

export const ProductGlary: Array<ProductType> = [product];
