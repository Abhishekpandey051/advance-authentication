import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJswt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      (await req.cookies?.accessToken)
    if (!token) {
      res.status(401);
      throw new ApiError(401, "Unauthorized user");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodeToken) {
      res.status(401);
      throw new ApiError(401, "Access token expired");
    }

    const user = await User.findById(decodeToken.id).select("-password");
    if (!user) {
      res.status(401);
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
