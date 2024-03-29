const { validateToken } = require("../lib/jwt");

module.exports = {
  tokenVerify: (req, res, next) => {
    let { token } = req.headers;

    if (!token) {
      return res.status(401).send({
        isError: true,
        message: "Token not found",
        data: null,
      });
    }

    console.log("s", token);

    try {
      const validateTokenResult = validateToken(token);
      req.uid = validateTokenResult;
      console.log(req.uid);
      next();
    } catch (error) {
      res.status(401).send({
        isError: true,
        message: "Invalid Token",
        data: error,
      });
    }
  },
};
