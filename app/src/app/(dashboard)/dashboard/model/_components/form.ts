import { z } from "zod";

// Assuming this is the dimension schema you already have
const dimensionSchema = z.object({
  label: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  end_x: z.number(),
  end_y: z.number(),
  end_z: z.number(),
});

// Fabric Range Schema for the reference
const fabricRangeSchema = z.object({
  fabricRangeId: z.number(),
});

// MashCrete schema as used in MashVariants
export const mashCreteSchema = z.object({
  itOptional: z.boolean().optional(),
  textureEnable: z.boolean().optional(),
  name: z.string(),
  mashName: z.string(),
  fabricRanges: z.array(fabricRangeSchema),
  mashVariant: z
    .object({
      name: z.string(),
      mash: z.array(
        z.object({
          itOptional: z.boolean().optional(),
          textureEnable: z.boolean().optional(),
          name: z.string(),
          mashName: z.string(),
          fabricRanges: z.array(fabricRangeSchema),
          url: z.string(),
          thumbnailUrl: z.string().optional(),
        })
      ),
    })
    .optional(),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
});

// MashVariants schema to include MashCrete
const mashVariantsSchema = z.object({
  name: z.string(),
  mash: z.array(mashCreteSchema),
});

// Final schema integration
export const schema = z.object({
  productId: z.number().min(1, "Product is required"),
  name: z.string().min(1),
  isDefault: z.boolean(),
  shadow: z.boolean(),
  autoRotate: z.boolean(),
  RotationSpeed: z.coerce.number().min(0),
  modelFile: z
    .any()
    .refine(
      (f) => f?.[0] && /\.(glb|obj)$/i.test(f[0].name),
      "Only .glb or .obj allowed"
    ),
  thumbnail: z.any().optional(),
  mashes: z.array(mashCreteSchema),
  dimensions: z.array(dimensionSchema),
  mashVariants: z.array(mashVariantsSchema).optional(), // Added MashVariants
});

export type FormDataType = z.infer<typeof schema>;
