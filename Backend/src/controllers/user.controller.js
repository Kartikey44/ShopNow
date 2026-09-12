import User from "../schemas/user.schema.js";
import { sendEmail } from "../services/email.service.js";
import {
  generateAuthTokens,
  hashPassword,
  generatePasswordResetToken,
  hashResetToken,
  comparePassword,
} from "../services/auth.service.js";

import ErrorHandler from "../utils/handleError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { success } from "zod";

// ================= REGISTER =================

export const register = catchAsyncErrors(async (req, res, next) => {
  const { fullname, email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return next(
      new ErrorHandler("User already exists. Please login to continue.", 409),
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullname,
    email: normalizedEmail,
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

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
  });
});

// ================= LOGIN =================

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
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
});

// ================= LOGOUT =================

export const logout = catchAsyncErrors(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= PROFILE =================

export const profile = catchAsyncErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ================= FORGOT PASSWORD =================

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Generate reset token
  const { resetToken, hashedToken } = generatePasswordResetToken();

  // Store hashed token
  user.resetPasswordToken = hashedToken;

  // Token expires after 15 minutes
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  // Frontend reset URL
  const resetPasswordUrl = `http://localhost:5173/reset-password/${resetToken}`;
  console.log(resetPasswordUrl);
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">

        <h2>ShopNow Password Reset</h2>

        <p>Hello ${user.fullname},</p>

        <p>
          You requested to reset your ShopNow password.
        </p>

        <p>
          Click the button below to reset your password:
        </p>

        <a
          href="${resetPasswordUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in
          <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset,
          please ignore this email.
        </p>

        <p>
          Regards,<br>
          ShopNow Team
        </p>

      </div>
    `;

  const text = `
ShopNow Password Reset

Hello ${user.fullname},

You requested to reset your ShopNow password.

Reset your password using this link:

${resetPasswordUrl}

This link will expire in 15 minutes.

If you did not request this password reset,
please ignore this email.

ShopNow Team
`;

  // Send email
  await sendEmail({
    email: user.email,
    name: user.fullname,
    subject: "ShopNow - Password Reset",
    html,
    text,
  });

  return res.status(200).json({
    success: true,
    message: "Password reset link has been sent to your email",
  });
});

// ================= RESET PASSWORD =================

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Check passwords
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password do not match", 400),
    );
  }

  // Hash token from URL
  const hashedToken = hashResetToken(token);

  // Find user and check token expiry
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return next(new ErrorHandler("Reset token is invalid or has expired", 400));
  }

  // Hash new password
  user.password = await hashPassword(password);

  // Remove reset token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // Save
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("New password and confirm password do not match", 400),
    );
  }
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordMatched = await comparePassword(oldPassword, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }
  user.password = await hashPassword(newPassword);
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { fullname, email, profilePicture } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Update fullname
  if (fullname !== undefined) {
    user.fullname = fullname;
  }

  // Update email
  if (email !== undefined) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if another user already has this email
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 409));
    }

    user.email = normalizedEmail;

    // If email verification is implemented
    // later, you can set this to false here.
    user.isEmailVerified = false;
  }

  // Update profile picture
  if (profilePicture !== undefined) {
    user.profilePicture = profilePicture;
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePicture: user.profilePicture,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  });
});

export const getUserList = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with this id: ${req.param.id}`, 400),
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;

  const newUserData = {
    role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next (new ErrorHandler("User doesn't exist",400))
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message:"User deleted successfully"
  })
})