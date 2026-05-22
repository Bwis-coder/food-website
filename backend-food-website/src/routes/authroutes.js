import express from "express";
import { authMiddleWare } from "../middleware/authMiddleWare.js";
import {
  registerValidator,
  loginValidator,
  updateValidator,
} from "../validators/validatorRegister.js";
import { validator } from "../middleware/validatorMiddleware.js";
import {
  register,
  login,
  logOut,
  update,
  deleteById,
  getUser,
  verifyEmail,
  chanagePassWord,
} from "../controllers/authController.js";
import { checkMailSchema, checkResetPassWordSchema } from "../validators/authValidator.js";
const router = express.Router();

router.post("/register", validator(registerValidator), register);

router.post("/login", validator(loginValidator), login);

router.post("/checkEmail", validator(checkMailSchema), verifyEmail);
router.put("/resetPassWord",validator(checkResetPassWordSchema), chanagePassWord);

router.use(authMiddleWare);

router.post("/logout", logOut);

router.put("/:id", validator(updateValidator), update);

router.delete("/:id", deleteById);

router.get("/", getUser);

export default router;
