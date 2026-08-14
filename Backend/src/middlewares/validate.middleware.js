import jwt from "jsonwebtoken";
import User from "../schemas/user.schema.js";
import ErrorHandler from "../utils/handleError.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    req.body = result.data;

    next();
  };
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(new ErrorHandler("Unauthorized", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid token", 401));
  }
};

export const roleBasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role-${req.user.role} is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
};
