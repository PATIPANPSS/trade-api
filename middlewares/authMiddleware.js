const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "ไม่มี Token ไม่อนุญาตให้เข้าถึง" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "MY_SECRET_KEY");

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

module.exports = verifyToken;
