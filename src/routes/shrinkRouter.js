import express from "express";
import sharp from "sharp";
import { verifyAccessToken } from "../utils/jwt.js";

const router = express.Router();

router.route("/").post(compressImage);

async function compressImage(req, res) {
  if (!verifyAccessToken(req)) {
    res.json({message:"not valid access"});
  }

  const { data, quality } = req.body;

  try {
    const processedImages = await Promise.all(
      data.map(async (item) => {
        const imageBuffer = Buffer.from(item.file, "base64");

        const fileType = item.fileType.toLowerCase();
        if (
          ![
            "jpeg",
            "jpg",
            "png",
            "webp",
            "tiff",
            "avif",
            "heif",
            "raw",
          ].includes(fileType)
        ) {
          throw new Error("Unsupported file type: " + fileType);
        }

        const compressedBuffer = await sharp(imageBuffer)
          [fileType]({ quality })
          .toBuffer();
        return {
          fileType,
          file: compressedBuffer.toString("base64"), // encode back to Base64
          name: item.name,
        };
      })
    );

    // Send all images as JSON
    res.json({
      message:"send compressed images",
      success: true,
      images: processedImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error compressing images",
      error: error.message,
    });
  }
}
export default router;
