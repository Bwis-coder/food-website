import express from "express";
import { authMiddleWare } from "../middleware/authMiddleWare.js";
import { validator, searchV } from "../middleware/validatorMiddleware.js";
import {
  addFoodValidator,
  updateFoodValidator,
  searchValidator,
} from "../validators/fooditemsValidator.js";
import {
  addFoodItems,
  updateFoodItems,
  deleteFoodItem,
  getFoodItems,
  searchFoodItems,
} from "../controllers/foodItemController.js";

const router = express.Router();

router.get("/searchItems", searchV(searchValidator), searchFoodItems);

router.use(authMiddleWare);
router.get("/getFoodItems", getFoodItems);

router.post("/addfood", validator(addFoodValidator), addFoodItems);

router.put("/update/:id", validator(updateFoodValidator), updateFoodItems);

router.delete("/delete/:id", deleteFoodItem);

export default router;
