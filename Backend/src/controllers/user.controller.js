import User from "../schemas/user.schema.js";
import {
  generateAuthTokens,
  hashPassword,
  comparePassword,
} from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber } = req.body;

    console.log(`[REGISTER ATTEMPT] ${email}`);

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      console.warn(`[REGISTER FAILED] User already exists: ${email}`);

      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user",
    });

    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`[REGISTER SUCCESS] ${user.email} (${user._id})`);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`[REGISTER ERROR] ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    console.log(`[LOGIN ATTEMPT] ${email || phoneNumber}`);

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (!user) {
      console.warn(`[LOGIN FAILED] User not found: ${email || phoneNumber}`);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      console.warn(`[LOGIN FAILED] Invalid password for ${user.email}`);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`[LOGIN SUCCESS] ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`[LOGIN ERROR] ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    console.log(`[LOGOUT ATTEMPT] ${req.user?.email || "Unknown User"}`);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    console.log(`[LOGOUT SUCCESS] ${req.user?.email || "Unknown User"}`);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(`[LOGOUT ERROR] ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const profile = async (req, res) => {
  try {
    console.log(`[PROFILE SUCCESS] ${req.user.email}`);

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(`[PROFILE ERROR] ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
