import { prisma } from "../../config/db"
import bcrypt from "bcryptjs";
import { generateToken } from "../../utility/generateToken";
const logIn = async (req,res)=>{
const { email,passWord } = req.body;

const user = await prisma.user.findUnique({
    where: {email}
})

if (!user) {
    return res.status(404).json({
        error: 'user cant be found please register for an account'
    })
}

const userPassword = await bcrypt.compare(passWord,user.password)

if (!userPassword) {
    return res.status(401).json({error: 'password not found'})
}

const token = generateToken(user.id)

res.cookie("jwt",token,{
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "development",
    maxAge: 60 * 60 * 1000 * 24 * 7
})

res.status(200).json({
    status: "successfull",
    data:{
        email
    }
})
}