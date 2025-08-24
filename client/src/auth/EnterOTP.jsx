import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../constant";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adduser } from "../store/userSlice";
import { toast } from "react-toastify";

const EnterOTP = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  if (userData?.isAccountverify) {
    navigate("/");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("Please enter a 6-digit OTP.");
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/verify-emial",
        { otp: otp },
        { withCredentials: true }
      );
      if (res) {
        toast(res?.data?.message);
        dispatch(adduser(res.data?.data));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      setMessage(error?.message);
    }
  };

  return (
    <main className="bg-gray-950 min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          Enter Verification OTP
        </h1>
        <p className="text-gray-400 mb-6">
          Please enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full p-3 rounded-md mb-6 bg-gray-800 text-white text-center tracking-widest text-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="______"
          />

          <button
            type="submit"
            className="w-full pb-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition"
          >
            Verify OTP
          </button>

          <button
            type="submit"
            className="w-full py-3 mt-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-md transition"
            onClick={() => navigate("/verify")}
          >
            Re-send OTP
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

export default EnterOTP;
