const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Resource not found. Invalid ${err.path}`;
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid Token";
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Token has expired";
  }

  console.log("Error Name:", err.name);
  console.log("Status Code:", err.statusCode);
  console.log("Message:", err.message);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
