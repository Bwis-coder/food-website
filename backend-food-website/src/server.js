import express from "express";
import foodItemsRoutes from "./routes/foodItemRoutes.js";
import { connectDb, disconnectDb } from "./config/db.js";
import { config } from "dotenv";
import authRoutes from "./routes/authroutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

config();
connectDb();

const app = express();
const port = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/foodImages", express.static("foodImages"));

// Routes
app.use("/foodItems", foodItemsRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

// serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend-foodwebsite/dist")));

  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend-foodwebsite/dist", "index.html"));
  });
}

process.on("SIGINT", disconnectDb);
process.on("SIGTERM", disconnectDb);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});