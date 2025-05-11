// import { FabricRage, Product as ProductType } from "@/types/type";

// export const fabricRage: FabricRage[] = [
//   {
//     id: 1,
//     name: "Bentley",
//     fabric: [...Array(12)].map((_, i) => {
//       const number = [
//         "917",
//         "919",
//         "923",
//         "929",
//         "935",
//         "941",
//         "944",
//         "946",
//         "901",
//         "902",
//         "905",
//         "909",
//       ][i];
//       return {
//         id: i + 1,
//         name: number,
//         size: 15,
//         url: `BENTLEY FABRIC RANGE/BENTLEY-${number}.jpg`,
//         thumbnailUrl: `BENTLEY FABRIC RANGE/BENTLEY-${number}.jpg`,
//       };
//     }),
//   },
//   {
//     id: 2,
//     name: "Jaguar",
//     fabric: [...Array(21)].map((_, i) => {
//       const number = 101 + i;
//       return {
//         id: i + 1,
//         name: `${number}`,
//         size: 2,
//         url: `JAGUAR FABRIC RANGE/JAGUAR-${number}.jpg`,
//         thumbnailUrl: `JAGUAR FABRIC RANGE/JAGUAR-${number}.jpg`,
//       };
//     }),
//   },
//   {
//     id: 3,
//     name: "Elegant",
//     fabric: [...Array(18)].map((_, i) => {
//       const num = (i + 1).toString().padStart(2, "0");
//       return {
//         id: i + 1,
//         name: `EG-${num}`,
//         size: 1,
//         url: `ELEGANT FABRIC RANGE/EG-${num}.jpg`,
//         thumbnailUrl: `ELEGANT FABRIC RANGE/EG-${num}.jpg`,
//       };
//     }),
//   },
// ];

// export const product: ProductType = {
//   id: 1,
//   name: "Queen Arm Chair",
//   imageBank: "",
//   pdfText: `
//   Dimensions:
// Height                   : 1130 mm
// Width                    : 780 mm
// Depth                    : 760 mm
// Seat Height          : 420 mm

// Application Area:
// Leisure

// Specifications:
// Shell:
// Steel Frame manufactured in CNC machines and joined on Fixture with Metal Inert Gas Welding with accuracy and low tolerance.
// Foam:
// CMRH Foam Injection Moulded, Average Density 50-55 Kg per M3 Technical specifications matching Poly Flex
// Weight:
// 14.5 Kg
// Packing:
// Volume (Disassembled) chair: 0.40 CBM, pouf: 0.02 CBM
// Packing:
// Available in Fabric/Leatherette (Leather available on specific request at extra cost)

//   `,
//   model: [
//     {
//       autoRotate: true,
//       id: 1,
//       isDefault: true,
//       RotationSpeed: 0.25,
//       shadow: true,
//       thumbnailUrl: "queen_arm_chair.jpg",
//       name: "Queen Arm chair with 180&deg; Auto return Swivel Base",
//       url: "Queen_Chair.glb",
//       dimensions: [
//         {
//           id: 1,
//           x: 5,
//           y: -3,
//           z: 0,
//           end_x: 5,
//           end_y: 3,
//           end_z: 0,
//           label: "1130mm",
//         },
//         {
//           id: 2,
//           x: -3,
//           y: -3,
//           z: 5,
//           end_x: 3,
//           end_y: -3,
//           end_z: 5,
//           label: "780mm",
//         },
//         {
//           id: 3,
//           x: -5,
//           y: -3,
//           z: -3,
//           end_x: -5,
//           end_y: -3,
//           end_z: 3,
//           label: "780mm",
//         },
//         {
//           id: 4,
//           x: 0,
//           y: -2.5,
//           z: 2.5,
//           end_x: 0,
//           end_y: -0.5,
//           end_z: 2.5,
//           label: "420mm",
//         },
//       ],
//       mash: [
//         {
//           id: 1,
//           itOptional: false,
//           textureEnable: true,

//           name: "Inner Face Fabric/Leatherette Rage Option",
//           mashName: "Fabric001_2",
//           url: null,
//           fabricRange: fabricRage,
//         },
//         {
//           id: 2,
//           itOptional: false,
//           textureEnable: true,

//           name: "Outer Face Fabric/Leatherette Rage Option",
//           mashName: "Fabric001_1",
//           url: null,
//           fabricRange: fabricRage,
//         },
//         {
//           id: 3,
//           itOptional: false,
//           textureEnable: false,

//           name: "Leg",
//           mashName: "R13_Leg",
//           url: null,
//           mashVariants: {
//             id: 1,
//             name: "Legs Options",
//             mash: [
//               {
//                 id: 1,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/D9.jpg",
//                 name: "D9",
//                 mashName: "R13_Leg",
//                 url: "Queen_Chair_D9_Leg.glb",

//                 fabricRange: [],
//               },
//               {
//                 id: 2,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/L21.jpg",
//                 name: "L21",
//                 mashName: "R13_Leg",
//                 url: "Queen_Chair_L21_Leg.glb",

//                 fabricRange: [],
//               },

//               {
//                 id: 3,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/R7.jpg",
//                 name: "R7",
//                 mashName: "R13_Leg",
//                 url: "Queen_Chair_R7_Leg.glb",
//                 fabricRange: [],
//               },
//               {
//                 id: 3,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/R13.jpg",
//                 name: "R13",
//                 mashName: "R13_Leg",
//                 url: "Queen_Chair_R13_Leg.glb",
//                 fabricRange: [],
//               },
//               {
//                 id: 3,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/S7.jpg",
//                 name: "S7",
//                 mashName: "R13_Leg",
//                 url: "Queen_Chair_S7_Leg.glb",
//                 fabricRange: [],
//               },
//             ],
//           },
//           fabricRange: [],
//         },
//       ],
//     },
//   ],
// };

// export const product2: ProductType = {
//   id: 2,
//   name: "Nora MB",
//   imageBank: "",
//   pdfText: `Chair name: Nora MB
// Dimensions:
// Height                   : 880 mm
// Width                    : 750 mm
// Depth                    : 800 mm
// Seat Height          : 420 mm
// Application Area:
// Private Zone

// Specifications:

// Shell:
// Steel Frame manufactured in CNC machines and joined on Fixture with Metal Inert Gas Welding with accuracy and low tolerance.
// Foam:
// CMRH Foam Injection Molded, Average Density 50-55 Kg per M3 Technical specifications matching Poly Flex
// SS Legs:
// Polished stainless steel base

// Wooden Legs:
// Stained ash wooden base, assembled, swivelling
// Weight:
// 13 Kg
// Packing:
// Volume (Disassembled) chair: 0.30 CBM, pouf: 0.02 CBM
// Seat Finishes:
// Available in Fabric/Leatherette (Leather available on specific request at extra cost).
// `,
//   thumbnailUrl: "nora chair 1.jpg",
//   model: [
//     {
//       autoRotate: true,
//       id: 2,
//       isDefault: true,
//       RotationSpeed: 0.25,
//       shadow: true,

//       name: "Nora MB",
//       url: "Nora_MB_Chair.glb",
//       dimensions: [
//         {
//           id: 1,
//           x: 5,
//           y: -3,
//           z: 0,
//           end_x: 5,
//           end_y: 3,
//           end_z: 0,
//           label: "880mm",
//         },
//         {
//           id: 2,
//           x: -3,
//           y: -3,
//           z: 5,
//           end_x: 3,
//           end_y: -3,
//           end_z: 5,
//           label: "750mm",
//         },
//         {
//           id: 3,
//           x: -5,
//           y: -3,
//           z: -3,
//           end_x: -5,
//           end_y: -3,
//           end_z: 3,
//           label: "800mm",
//         },
//         {
//           id: 4,
//           x: 0,
//           y: -2.5,
//           z: 2.5,
//           end_x: 0,
//           end_y: -0.5,
//           end_z: 2.5,
//           label: "420mm",
//         },
//       ],
//       mash: [
//         {
//           id: 1,
//           itOptional: false,
//           textureEnable: true,

//           name: "Seat Fabric /Leatherette Rage Option",
//           mashName: "Fabric",
//           url: null,
//           fabricRange: fabricRage,
//         },

//         {
//           id: 3,
//           itOptional: false,
//           textureEnable: false,

//           name: "Leg",
//           mashName: "Legs",
//           url: null,
//           mashVariants: {
//             id: 1,
//             name: "Legs Options",
//             mash: [
//               {
//                 id: 1,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/nora/D9.jpg",
//                 name: "D9",
//                 mashName: "Legs",
//                 url: "Nora_Chair_D9_Leg.glb",
//                 fabricRange: [],
//               },
//               {
//                 id: 2,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/nora/L30.jpg",
//                 name: "L30",
//                 mashName: "Legs",
//                 url: "Nora_Chair_L30_Leg.glb",
//                 fabricRange: [],
//               },

//               {
//                 id: 3,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/nora/L31.jpg",
//                 name: "L31",
//                 mashName: "Legs",
//                 url: "Nora_Chair_L31_Leg.glb",
//                 fabricRange: [],
//               },
//               {
//                 id: 3,
//                 itOptional: false,
//                 textureEnable: false,
//                 thumbnailUrl: "uploads/nora/S7.jpg",
//                 name: "S7",
//                 mashName: "Legs",
//                 url: "Nora_Chair_S7_Leg.glb",
//                 fabricRange: [],
//               },
//             ],
//           },
//           fabricRange: [],
//         },
//       ],
//     },
//   ],
// };
// export const ProductGlary: Array<ProductType> = [product, product2];
