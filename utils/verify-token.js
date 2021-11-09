const jwt = require("jsonwebtoken");
// const TokenGenerator  = require('../recruiters/recruiters.controller')
const secret_token = process.env.SECRET_TOKEN;
module.exports = function (req, res, next) {
  const token = req.header("auth_token");

  // Checking for token in the header
  if (!token) {
    return res.status(401).send("Access Denied, token missing");
  } else {
    try {
      const verified = jwt.verify(
        token,
        secret_token,
        (err, authorizedData) => {
          if (err) {

            //If error send Forbidden (403)
            console.log("ERROR: Could not connect to the protected route");
            res.status(403)

            throw err;

          } else {
            //If token is successfully verified, we can send the autorized
            console.log("SUCCESS: Connected to protected route");
            console.log("verified:", authorizedData);
            next();
          }
        }
      );

      req.user = verified;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session timed out, please login again" });
      } else if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token,please login again" });
      } else {
        // catch other unprecedented console.error;
        return res.status(400).json({ error });
      }
    }
  }
};
