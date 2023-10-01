const jwt = require("jsonwebtoken");
const User = require("./models/user");

const jwtKey = process.env.JWT_SECRET;

const middleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, jwtKey);
    console.log(decoded, "decoded is done");
    //   req.user = decoded.userId;
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = middleware;
