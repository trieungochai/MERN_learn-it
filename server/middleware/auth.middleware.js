require("dotenv").config();
const JWT = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const accessToken = authHeader?.split(" ")[1];
  if (!accessToken)
    return res
      .status(401)
      .json({ success: false, message: "Access Token not found" });

  try {
    const decoded = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: "Invalid Token" });
  }
};

module.exports = verifyToken;
