import { Router } from "express";
import * as authController from "../controller/auth.controller";
const router = Router();
router.post("/login", async (req, res) => {
  try {
    await authController.Login(req, res);
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    await authController.Register(req, res);
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
});
export default router;
