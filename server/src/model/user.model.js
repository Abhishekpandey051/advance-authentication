import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
    varifyOtp: {
        type: String,
        default: '',
        trim: true,
        // minLength: 4,
        // maxlength: 4,
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0,
    },
    isAccountverify: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
        trim: true,
        // minLength: 4,
        // maxlength: 4,
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    // Hashing password logic here
    this.password =  await bcrypt.hash(this.password, 10)
    next();
})

export const User = mongoose.model("User", userSchema);
