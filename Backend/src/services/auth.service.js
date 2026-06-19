import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hash Password
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare Password
 */
export const comparePassword = async (
  password,
  hashedPassword
) => {
  return bcrypt.compare(
    password,
    hashedPassword
  );
};

/**
 * Generate Access Token
 */
export const generateAccessToken = (
  userId,
  role
) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (
  userId
) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (
  token
) => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
  );
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (
  token
) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );
};

/**
 * Generate Auth Tokens
 */
export const generateAuthTokens = (
  user
) => {
  const accessToken =
    generateAccessToken(
      user._id,
      user.role
    );

  const refreshToken =
    generateRefreshToken(user._id);

  return {
    accessToken,
    refreshToken,
  };
};