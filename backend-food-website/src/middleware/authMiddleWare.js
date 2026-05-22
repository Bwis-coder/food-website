import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const authMiddleWare = async (req, res, next) => {
  console.log("authMiddleWare reached");
const token = req.cookies.jwt;
if (!token) {
  error: 'not logged in'
}

try {
  const decode = jwt.verify(token,process.env.JWT_SECRET)

  const user = await prisma.user.findUnique({
    where: {id: decode.id}
  })
  if (!user) {
    return res.status(404).json({error: 'not authorised user'})
  }

  req.user = user;
  next()
} catch (error) {
  return res.status(500).json({
    status: 'error',
    message: `message: ${error.message}`
  })
}


};

export { authMiddleWare };
