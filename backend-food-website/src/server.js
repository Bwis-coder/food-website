import express from "express";
import foodItemsRoutes from "./routes/foodItemRoutes.js";
import { connectDb, disconnectDb } from "./config/db.js";
import { config } from "dotenv";
import authRoutes from "./routes/authroutes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoutes.js";
import cors from "cors";
import adminRoutes from "./routes/adminRoutes.js";

config();
connectDb();

const app = express();
const port = 5001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
//body parsing midware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/foodImages", express.static("foodImages"));

//Routes
app.use("/foodItems", foodItemsRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

process.on("SIGINT", disconnectDb);
process.on("SIGTERM", disconnectDb);

app.listen(port, () => {
  console.log(`${process.env.WEB_URL}`);
});
