import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../constant";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [resetPassworKey, setResetPasswordKey] = useState({
        email:'',
        otp: '',
        oldPassword: '',
        newPassword: ''
    })
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetOtp = async () => {
    try {
        const res = await axios.post(BASE_URL + "/reset-otp", {email:resetPassworKey.email}, {withCredentials:true})
        console.log(res)
        if(res) {
            setMessage(res?.data?.message)
        }
    } catch (error) {
        setMessage(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (resetPassworKey.otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!resetPassworKey.oldPassword) {
      setMessage("Please enter your old password.");
      return;
    }

    if (resetPassworKey.newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      return;
    }

    setMessage("Processing password change...");

    try {
        const res = await axios.patch(BASE_URL + "/forgot-password", resetPassworKey, {withCredentials:true})
        console.log("Forgot password", res)
        if(res) {
            navigate("/auth")
            setMessage("Password changed successfully!");
        }
    } catch (error) {
        setMessage(error.message || "Failed to change update password")
    }
    
    
  };

  return (
    <main className="bg-gray-950 min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Reset Password</h1>
        <p className="text-gray-400 mb-6">
          Enter the OTP sent to your email along with your old password and your new password.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          <label className="block mb-2 text-gray-300" htmlFor="otp">
            OTP
          </label>
          <input
            type="text"
            id="email"
            value={resetPassworKey.email}
            onChange={(e) => setResetPasswordKey({ ...resetPassworKey, email: e.target.value })}
            className="w-full p-3  rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="you@gmail.com"
          />

          <button
            type="button"
            onClick={handleResetOtp}
            className="mb-6 text-sm text-blue-500 hover:underline focus:outline-none"
          >
            Reset OTP
          </button>

           <label className="block mb-2 text-gray-300" htmlFor="oldPassword">
            OTP
          </label>
          <input
            type="text"
            id="otp"
            value={resetPassworKey.otp}
            maxLength={6}
            onChange={(e) => setResetPasswordKey({...resetPassworKey, otp: e.target.value})}
            className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="6-digit OTP"
          />

          <label className="block mb-2 text-gray-300" htmlFor="oldPassword">
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            value={resetPassworKey.oldPassword}
            onChange={(e) => setResetPasswordKey({...resetPassworKey, oldPassword: e.target.value})}
            className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your old password"
          />

          <label className="block mb-2 text-gray-300" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={resetPassworKey.newPassword}
            onChange={(e) => setResetPasswordKey({...resetPassworKey, newPassword: e.target.value})}
            className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter your new password"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 font-medium ${
              message.includes("success") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
};

export default ForgotPassword;
