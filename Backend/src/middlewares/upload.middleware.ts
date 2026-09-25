import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"];

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImageMimetype = file.mimetype.startsWith("image/");
    const isImageExtension = ALLOWED_EXTENSIONS.includes(ext);

    if (isImageMimetype && isImageExtension) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});