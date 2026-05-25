import { v2 as cloudinary } from "cloudinary";
import { prisma } from "./config/db.js";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImages = async () => {
  const foods = await prisma.food.findMany();

  for (const food of foods) {
    try {
      // upload local image to cloudinary
      const result = await cloudinary.uploader.upload(food.image, {
        folder: "food-website",
      });

      // update the database with the cloudinary URL
      await prisma.food.update({
        where: { id: food.id },
        data: { image: result.secure_url },
      });

      console.log(`uploaded: ${food.name} → ${result.secure_url}`);
    } catch (error) {
      console.error(`failed: ${food.name} → ${error.message}`);
    }
  }

  await prisma.$disconnect();
  console.log("done");
};

uploadImages();