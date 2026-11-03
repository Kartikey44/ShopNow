import crypto from "crypto";
import getRazorpayClient from "../configs/razorpay.config.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/handleError.js";

export const createRazorpayOrder = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return next(new ErrorHandler("Razorpay is not configured", 503));
  }
  if (
    typeof amount !== "number" ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 10000000
  ) {
    return next(new ErrorHandler("Invalid payment amount", 400));
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `shopnow_${Date.now()}`,
  };

  const order = await getRazorpayClient().orders.create(options);

  res.status(200).json({
    success: true,
    order,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

export const verifyRazorpayPayment = catchAsyncErrors(
  async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(
        new ErrorHandler("Payment verification details are missing", 400),
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return next(new ErrorHandler("Razorpay is not configured", 503));
    }

    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string"
    ) {
      return next(new ErrorHandler("Payment verification details are invalid", 400));
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expected = Buffer.from(generatedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");
    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return next(new ErrorHandler("Payment verification failed", 400));
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
    });
  },
);
