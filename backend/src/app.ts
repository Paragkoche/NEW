import express from "express";
import router from "./router";
import logger from "./utility/logger";
import path from "path";
import fs from "fs";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json({}));

app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(
    ...__dirname.split("\\").splice(0, __dirname.split("\\").length - 1),
    "uploads",
    req.params.filename
  );
  console.log(filePath);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err);

      return res.status(404).send("File not found");
    }

    res.sendFile(filePath);
  });
});

app.use("/api", router);
export default app;
