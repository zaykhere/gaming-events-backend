const bcrypt = require("bcryptjs");
const RegisterValidation = require("../validation/registerValidation");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sign } = require("jsonwebtoken");
const mailer = require("../utils/mailer");
const otpgen = require("../utils/otpgen");

const saltRounds = 10;

exports.login = async(req,res) => {
  const {email, password} = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })
    if(!user) return res.status(404).json({error:"Invalid credentials"});
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword) return res.status(404).json({error:"Invalid credentials"});
    let id = user.id;
    res.status(200).json({
      token: sign({id}, process.env.JWT_SECRET)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Unexpected Error while logging in"});
  }
}

exports.register = async (req, res) => {
    const { error } = RegisterValidation.validate(req.body);
  
    if (error) return res.status(400).send(error);
  
    if (req.body.password !== req.body.confirm_password)
      return res.status(400).json({
        message: "Passwords do not match",
      });
  
    try {
      const findUser = await prisma.user.findUnique({
          where: {
              email: req.body.email
          }
      })
  
      if (findUser)
        return res.status(400).json({ error: "Email or username exists already" });
  
      const otpCode = await otpgen.digits(4);
      const { password, ...user } = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          username: req.body.username,
          password: await bcrypt.hash(req.body.password, saltRounds),
          verificationToken: otpCode,
          isVerified: false,
        },
      });
  
      await mailer.send(
        user.email,
        "Gaming Events OTP",
        `<h3>The GamingEvents OTP code is ${otpCode} Please go to this link
       <a href=${process.env.SERVER_URL}/api/emailverify style={color: "red"}> Server Link </a>
        </h3>
        
        `
      );
      res.json({
        message: "Please check your email for OTP code",
        resendLink: `${process.env.SERVER_URL}/api/resendEmailCode/${user.email}`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };

  exports.emailVerify = async (req, res) => {
    try {
      const { email, otpCode } = req.body;
      let user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          verificationToken: true,
        },
      });
      if (!user) return res.status(404).json({ error: "OTP Failed" });
  
      if (user.verificationToken != otpCode)
        return res.json({ error: "OTP Incorrect" });
  
      let updatedUser = await prisma.user.update({
        where: {
          email: req.body.email,
        },
        data: {
          isVerified: true,
        },
      });
  
      res.json({ message: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.resendEmailCode = async (req, res) => {
    try {
      console.log(req.params.email);
      const otpCode = await otpgen.digits(4);
      const email = req.params.email;
  
      let user = await prisma.user.findUnique({
        where: {
          email: email
        },
      });
  
      if (!user) return res.status(404).json({ error: "Invalid Email" });
  
      let updatedUser = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          verificationToken: otpCode,
        },
      });
  
      await mailer.send(
        user.email,
        "Gaming Events OTP",
        `<h1>The Gaming Events OTP code is ${otpCode} <br /> Please go to this link
     <a href=${process.env.SERVER_URL}/api/emailverify> Server Link </a>
      </h1>`
      );
      res.json({ message: "Please check your email for OTP code" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  };