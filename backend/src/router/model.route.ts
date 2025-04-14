import { Router } from "express";
import * as modelController from "../controller/model.controller";
import authMiddleware, { AuthReq } from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.get("/", modelController.getAllModel);
router.post("/product-data", (req, res) =>
  modelController.createProduct(req as AuthReq, res)
);
router.post("/add-model-data", (req, res) =>
  modelController.addModelData(req as AuthReq, res)
);

router.post("/add-fabric-data", (req: any, res) =>
  modelController.addFabric(req, res)
);
router.post("/add-variant-data", (req: any, res) =>
  modelController.addVariant(req, res)
);

router.post(
  "/product-upload-thumbnail/:modelId",
  upload.single("thumbnail"),
  (req: any, res) => modelController.uploadProductThumbnail(req, res)
);

router.post(
  "/upload-model-thumbnail/:modelId",
  upload.single("thumbnail"),
  (req: any, res) => modelController.uploadModelThumbnail(req, res)
);

router.post("/upload-model/:modelId", upload.single("model"), (req: any, res) =>
  modelController.uploadModelURL(req, res)
);

router.post(
  "/fabric-upload/:fabricId",
  upload.single("fabric"),
  (req: any, res) => modelController.uploadFabric(req, res)
);
router.post(
  "/fabric-upload/thumbnail/:fabricId",
  upload.single("fabric-thumbnail"),
  (req: any, res) => modelController.uploadFabricThumbnail(req, res)
);
router.post(
  "/variants-upload/:variantId",
  upload.single("variant"),
  (req: any, res) => modelController.uploadVariant(req, res)
);
router.post(
  "/variants-upload/thumbnail/:variantId",
  upload.single("variant-thumbnail"),
  (req: any, res) => modelController.uploadVariantThumbnail(req, res)
);

router.post("/env-data", modelController.addEnvData);
router.post("/env-upload/:envId", upload.single("env"), (req: any, res) =>
  modelController.uploadEnv(req, res)
);
router.post(
  "/env-upload/thumbnail/:envId",
  upload.single("env-thumbnail"),
  (req: any, res) => modelController.uploadEnvThumbnail(req, res)
);
router.post("/add-bg", modelController.addBg);

router.post("/add-model-and-connect-variants-n-fabric/:modelId", (req, res) =>
  modelController.addModelConn(req, res)
);
router.post("/connect-every-thinks/:productId", (req, res) =>
  modelController.connectEveryThinks(req, res)
);
router.get("/:id", modelController.getIdModel);

export default router;
