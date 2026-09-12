import Address from "../schemas/address.schema.js";
import ErrorHandler from "../utils/handleError.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

// Create Address
export const createAddress = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const {
    fullname,
    mobile,
    houseNo,
    street,
    city,
    state,
    country,
    pincode,
    addressType,
    isDefault,
  } = req.body;

  // Validate required fields
  if (
    !fullname ||
    !mobile ||
    !houseNo ||
    !street ||
    !city ||
    !state ||
    !pincode
  ) {
    return next(new ErrorHandler("All address fields are required", 400));
  }

  // If this address is default, remove default from previous addresses
  if (isDefault) {
    await Address.updateMany({ user: userId }, { $set: { isDefault: false } });
  }

  const address = await Address.create({
    user: userId,
    fullname,
    mobile,
    houseNo,
    street,
    city,
    state,
    country: country || "India",
    pincode,
    addressType: addressType || "home",
    isDefault: isDefault || false,
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address,
  });
});

// Get All User Addresses
export const getAddresses = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const addresses = await Address.find({
    user: userId,
  }).sort({ isDefault: -1, createdAt: -1 });

  res.status(200).json({
    success: true,
    addresses,
  });
});

// Get Address By ID
export const getAddressById = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const address = await Address.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  res.status(200).json({
    success: true,
    address,
  });
});

// Update Address
export const updateAddress = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const address = await Address.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  const {
    fullname,
    mobile,
    houseNo,
    street,
    city,
    state,
    country,
    pincode,
    addressType,
    isDefault,
  } = req.body;

  // If setting this address as default
  if (isDefault === true) {
    await Address.updateMany(
      {
        user: userId,
        _id: { $ne: address._id },
      },
      { $set: { isDefault: false } },
    );
  }

  address.fullname = fullname ?? address.fullname;
  address.mobile = mobile ?? address.mobile;
  address.houseNo = houseNo ?? address.houseNo;
  address.street = street ?? address.street;
  address.city = city ?? address.city;
  address.state = state ?? address.state;
  address.country = country ?? address.country;
  address.pincode = pincode ?? address.pincode;
  address.addressType = addressType ?? address.addressType;
  address.isDefault = isDefault ?? address.isDefault;

  await address.save();

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

// Delete Address
export const deleteAddress = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  const address = await Address.findOne({
    _id: req.params.id,
    user: userId,
  });

  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});
