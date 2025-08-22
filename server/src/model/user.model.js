import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

userSchema.methods.isPasswordNatched = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccssToken = async function() {
    return jwt.sign({
        id: this._id,
        name: this.name,
        email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}


export const User = mongoose.model("User", userSchema);
