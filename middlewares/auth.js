const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ error: "You are not allowed to visit this route" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
          where: {
              id: decoded.id
          }
      })

      if(!user) return res.json({error: "Invalid credentials"});

      req.user = user;
      next();
      
  } catch (error) {
      console.log(error);
      res.status(500).json({error: "Error while verifying user"});
  }
};

module.exports.protect = protect;
