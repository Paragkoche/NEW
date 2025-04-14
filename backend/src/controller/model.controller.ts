import { Request, Response } from "express";
import db from "../db";
import { number, z } from "zod";
import { AuthReq } from "../middleware/auth.middleware";
export const getAllModel = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    return res.json({
      models: await db.product.findMany(),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};
// async function getMashDeep(id: number) {
//   const mash = await db.mash.findUnique({
//     where: { id },
//     include: {
//       variants: true, // Get direct variants
//     },
//   });

//   // Recursively fetch variants of variants
//   if (mash?.variants?.) {
//     mash.variants = await Promise.all(
//       mash.variants.map(async (variant) => await getMashDeep(variant.id))
//     );
//   }

//   return mash;
// }
export const getIdModel = async (req: Request, res: Response): Promise<any> => {
  try {
    return res.json({
      models: await db.product.findUnique({
        where: {
          id: Number(req.params.id),
        },
        include: {
          model: {
            include: {
              mash: {
                include: {
                  variants: true,
                  textures: true,
                },
              },
            },
          },
          Env: true,
          bgs: true,
        },
      }),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const addProductBody = z.object({
  name: z.string(),
});

export const createProduct = async (
  req: AuthReq,
  res: Response
): Promise<any> => {
  try {
    const body = addProductBody.parse(req.body);

    return res.json({
      data: await db.product.create({
        data: {
          name: body.name,
        },
      }),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};
interface Req extends Request {
  file: Express.Multer.File;
}
export const uploadProductThumbnail = async (
  req: Req,
  res: Response
): Promise<any> => {
  try {
    const modelId = req.params.modelId;
    const model = await db.product.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "Model not found!!",
      });
    await db.product.update({
      where: {
        id: Number(modelId),
      },
      data: {
        thumbnailUrl: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.product.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const addModelBody = z.object({
  name: z.string(),
  isDefault: z.boolean(),
  shadow: z.boolean(),
  autoRotate: z.boolean(),
  RotationSpeed: z.number(),
  productId: z.number(),
});
export const addModelData = async (
  req: AuthReq,
  res: Response
): Promise<any> => {
  try {
    const body = addModelBody.parse(req.body);
    const model = await db.model.findUnique({
      where: {
        name: body.name,
      },
    });
    if (model) {
      await db.model.update({
        where: {
          id: model.id,
        },
        data: {
          isDefault: body.isDefault,
          shadow: body.shadow,
          autoRotate: body.autoRotate,
          RotationSpeed: body.RotationSpeed,
          productId: body.productId,
        },
      });
      return res.json({
        data: await db.model.findUnique({
          where: {
            id: model.id,
          },
        }),
      });
    }
    await db.model.create({
      data: {
        name: body.name,
        isDefault: body.isDefault,
        shadow: body.shadow,
        autoRotate: body.autoRotate,
        RotationSpeed: body.RotationSpeed,
        productId: body.productId,
      },
    });
    return res.json({
      data: await db.model.findUnique({
        where: {
          name: body.name,
        },
      }),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadModelThumbnail = async (
  req: Req,
  res: Response
): Promise<any> => {
  try {
    const modelId = req.params.modelId;
    const model = await db.model.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "Model not found!!",
      });
    await db.model.update({
      where: {
        id: Number(modelId),
      },
      data: {
        thumbnailUrl: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.product.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadModelURL = async (req: Req, res: Response): Promise<any> => {
  try {
    const modelId = req.params.modelId;
    const model = await db.model.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "Model not found!!",
      });
    await db.model.update({
      where: {
        id: Number(modelId),
      },
      data: {
        url: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.model.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const addFabricData = z.object({
  name: z.string(),
  size: z.number(),
});

export const addFabric = async (req: AuthReq, res: Response): Promise<any> => {
  try {
    const body = addFabricData.parse(req.body);
    const data = await db.fabric.create({
      data: {
        name: body.name,
        size: body.size,
      },
    });
    return res.json({
      data,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};
const addVariantBody = z.object({
  itOptional: z.boolean(),
  textureEnable: z.boolean(),
  name: z.string(),
  fabricId: z.array(z.number()).optional(),
});
export const addVariant = async (req: AuthReq, res: Response): Promise<any> => {
  try {
    const body = addVariantBody.parse(req.body);
    const data = await db.mash.create({
      data: {
        itOptional: body.itOptional,
        textureEnable: body.textureEnable,
        name: body.name,
      },
    });
    if (body.fabricId) {
      const fabric = await Promise.all(
        body.fabricId.map(async (id) => {
          return db.fabric.findUnique({
            where: {
              id,
            },
          });
        })
      );
      if (fabric.includes(null) && body.fabricId.length > 0) {
        return res.status(404).json({
          message: "fabric not found, try to upload fabric first",
        });
      }
      await Promise.all(
        fabric.map((f) =>
          db.fabric.update({
            where: {
              id: f?.id,
            },
            data: {
              mashId: data.id,
            },
          })
        )
      );
    }

    return res.json({
      data,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadFabricThumbnail = async (
  req: Req,
  res: Response
): Promise<any> => {
  try {
    const modelId = req.params.fabricId;
    const model = await db.fabric.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.fabric.update({
      where: {
        id: Number(modelId),
      },
      data: {
        thumbnailUrl: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.fabric.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadFabric = async (req: Req, res: Response): Promise<any> => {
  try {
    const modelId = req.params.fabricId;
    const model = await db.fabric.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.fabric.update({
      where: {
        id: Number(modelId),
      },
      data: {
        url: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.fabric.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadVariantThumbnail = async (
  req: Req,
  res: Response
): Promise<any> => {
  try {
    const modelId = req.params.variantId;
    const model = await db.mash.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.mash.update({
      where: {
        id: Number(modelId),
      },
      data: {
        thumbnailUrl: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.fabric.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadVariant = async (req: Req, res: Response): Promise<any> => {
  try {
    const modelId = req.params.variantId;
    const model = await db.mash.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.mash.update({
      where: {
        id: Number(modelId),
      },
      data: {
        url: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.mash.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const envData = z.object({
  name: z.string(),
});

export const addEnvData = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = envData.parse(req.body);
    const env = await db.env.create({
      data: {
        name: body.name,
      },
    });
    return res.json({
      data: env,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadEnv = async (req: Req, res: Response): Promise<any> => {
  try {
    const modelId = req.params.envId;
    const model = await db.env.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    console.log(req.file.path);

    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.env.update({
      where: {
        id: Number(modelId),
      },
      data: {
        url: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.env.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

export const uploadEnvThumbnail = async (
  req: Req,
  res: Response
): Promise<any> => {
  try {
    const modelId = req.params.envId;
    const model = await db.env.findUnique({
      where: {
        id: Number(modelId),
      },
    });
    if (!model)
      return res.status(404).json({
        message: "fabric not found!!",
      });
    await db.env.update({
      where: {
        id: Number(modelId),
      },
      data: {
        thumbnailUrl: req.file.path.replace("\\", "/"),
      },
    });
    return res.json({
      data: await db.env.findUnique({
        where: {
          id: model.id,
        },
      }),
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const bgData = z.array(
  z.object({
    color: z.string(),
  })
);

export const addBg = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = bgData.parse(req.body);
    const bgs: any[] = [];
    for (const v of body) {
      let data = await db.bgs.create({
        data: v,
      });
      bgs.push(data);
    }
    return res.json({
      data: bgs,
    });
  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const connectData = z.object({
  bgs: z.array(z.object({ id: z.number() })),
  env: z.array(z.object({ id: z.number() })),
});

export const connectEveryThinks = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = connectData.parse(req.body);

    const productId = Number(req.params.productId);

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    // Update bgs to link productId
    if (body.bgs.length > 0) {
      await db.bgs.updateMany({
        where: { id: { in: body.bgs.map((b) => b.id) } },
        data: { productId },
      });
    }

    // Update env to link productId
    if (body.env.length > 0) {
      await db.env.updateMany({
        where: { id: { in: body.env.map((e) => e.id) } },
        data: { productId },
      });
    }

    return res.json({
      message: "Connections established successfully",
    });
  } catch (e) {
    console.error("Error connecting entities:", e);
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const addConnModelBody = z.object({
  productId: z.number(),
  mash: z.array(
    z.object({
      id: z.number(),
      fabrics: z.array(z.object({ id: z.number() })),
      variant: z.array(
        z.object({
          id: z.number(),
          fabrics: z.array(z.object({ id: z.number() })).optional(),
        })
      ),
    })
  ),
});

export const addModelConn = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const body = addConnModelBody.parse(req.body);
    const modelId = Number(req.params.modelId);
    console.log(body, modelId);

    const model = await db.model.findUnique({
      where: {
        id: modelId,
      },
    });
    if (!model) {
      return res.status(404).json({
        message: "Model not found",
      });
    }
    for (const mash of body.mash) {
      // Update Mash: connect textures and optionally set productId
      await db.mash.update({
        where: { id: mash.id },
        data: {
          textures: {
            connect: mash.fabrics,
          },
          modelId,
          // Optional, depending on your schema usage
        },
      });

      // Update Models where mashId = mash.id to link with product
      await db.model.updateMany({
        where: {
          id: modelId,
        },
        data: { productId: body.productId },
      });

      // Update Variants of this mash
      for (const variant of mash.variant) {
        if (variant.fabrics && variant.fabrics.length > 0) {
          for (let fabric of variant.fabrics) {
            await db.fabric.update({
              where: {
                id: fabric.id,
              },
              data: {
                mashId: variant.id,
              },
            });
          }
          // await db.mash.update({
          //   where: { id: variant.id },
          //   data: {
          //     textures: {
          //       connect: variant.fabrics,
          //     },
          //     mashId: mash.id,
          //   },
          // });
        }
        await db.mash.update({
          where: { id: variant.id },
          data: {
            mashId: mash.id,
          },
        });
      }
    }
    return res.json({
      message: "Connections established successfully",
    });
  } catch (e) {
    console.error("Error connecting entities:", e);
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};
