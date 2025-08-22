import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../model/user.model.js";

const options = {
  httpOnly: true,
  secure: true,
};

// register user - API
const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({
    email,
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

// Login user - API

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new ApiError(400, "user does not exist");
  }
  const isPasswordCorrect = await user.isPasswordNatched(password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new ApiError(400, "Invalid credentials");
  }
  const accessToken = await user.generateAccssToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User login successfully"
      )
    );
});

// logout user - API
const userLogout = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        accessToken: 1,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, user, "User logout successfully"));
});

export { userRegister, userLogin, userLogout };
