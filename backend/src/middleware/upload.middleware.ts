import multer from "multer";
import path from "path";
import fs from "fs";

// Choose where files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/";

    // Create folder if it doesn't exist
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "model/gltf-binary", // for .glb
      "model/gltf+json", // for .gltf
      "text/plain", // .obj (most common)
      "application/octet-stream",
      "image/vnd.radiance", // for .hdr
    ];
    console.log(file.mimetype, allowedTypes.includes(file.mimetype));

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
