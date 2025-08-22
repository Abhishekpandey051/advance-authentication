import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../model/user.model.js";

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    res.status(400);
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -varifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt"
  );
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export { userRegister };
