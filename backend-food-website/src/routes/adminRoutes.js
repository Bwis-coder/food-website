import express from "express";
import { authMiddleWare } from "../middleware/authMiddleWare.js";
import {
  getConfirmedOrder,
  updateAdminStatus,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleWare);

router.get("/confirm-orders", getConfirmedOrder);

router.put("/updateStatus/:id", updateAdminStatus);

export default router;