import { Router } from "express";
import authRoute from "./auth.route";
import modelRoute from "./model.route";
const router = Router();
router.use("/auth", authRoute);
router.use("/model", modelRoute);
export default router;
