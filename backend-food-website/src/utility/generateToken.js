import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const playLoad = { id: userId };

  const token = jwt.sign(playLoad, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on Render, false locally
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-origin
    maxAge: 60 * 60 * 1000 * 24 * 7,
  });
  return token;
};

export { generateToken };
