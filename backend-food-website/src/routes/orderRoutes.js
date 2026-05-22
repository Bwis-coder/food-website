import express from "express";
import {
  getOrderItem,
  getOrderByUser,
  deleteItems,
  addFoodQuantity,
  updateOrderItem,
  placeOrder
} from "../controllers/orderController.js";
import { authMiddleWare } from "../middleware/authMiddleWare.js";
import { validator } from "../middleware/validatorMiddleware.js";
import { foodQuantity } from "../validators/fooditemsValidator.js";

const Router = express.Router();

Router.use(authMiddleWare);

Router.get('/placeOrders/:id', placeOrder)
Router.get("/getOrder",getOrderByUser);
Router.get("/getOrderItem", getOrderItem);
Router.delete("/delete/:id", deleteItems);
Router.post("/addQuantity", validator(foodQuantity), addFoodQuantity);
Router.put("/update/:id", updateOrderItem);
export default Router;
