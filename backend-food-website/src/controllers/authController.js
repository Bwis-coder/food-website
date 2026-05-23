import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utility/generateToken.js";
import crypto from "crypto";
import { sendMail } from "../utility/sendMail.js";

// register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Not Authorise User With The Same Email Exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role,
      },
    });

    const token = generateToken(user.id, res);

    return res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        name,
        email,
        role,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        error: "email not found try again latter",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        error: "incorrect password try again later",
      });
    }

    const token = generateToken(user.id, res);

    return res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        email,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// logout
const logOut = async (_, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      status: "success",
      message: "logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// update user
const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    const updateUser = {};

    if (name !== undefined) updateUser.name = name;
    if (email !== undefined) updateUser.email = email;

    if (password !== undefined) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateUser.password = hashPassword;
    }

    const changeUser = await prisma.user.update({
      where: { id },
      data: updateUser,
    });

    return res.status(200).json({
      status: "changed successfully",
      data: changeUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// delete user
const deleteById = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    const deleteUser = await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "deleted successfully",
      data: deleteUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// get user
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        orders: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// verify email
const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "Email not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/password-reset?token=${resetToken}&email=${email}`;

    await sendMail(
      email,
      "reset your password",
      `this link will expire in 15 minutes:${resetUrl}`
    );

    return res.status(200).json({
      status: "success email found",
      data: { resetToken, resetTokenExpiry },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// change password
const chanagePassWord = async (req, res) => {
  try {
    const { email, password, token } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const expiryDate = user?.resetTokenExpiry
      ? new Date(user.resetTokenExpiry)
      : null;

    if (
      !user ||
      user.resetToken !== token ||
      !expiryDate ||
      expiryDate < new Date()
    ) {
      return res.status(403).json({
        error: "expired token please resend token",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({
      status: "password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  register,
  login,
  logOut,
  update,
  deleteById,
  getUser,
  verifyEmail,
  chanagePassWord,
};