import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [error, setError] = useState("");
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();

    if(userData?.isAccountverify){
        navigate("/")
    }
  const handleResend = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/send-otp",
        {},
        { withCredentials: true }
      );
      if (res) {
        toast(res?.data?.message)
        navigate("/otp");
      }
    } catch (error) {
      toast(error?.message)
      console.log("ERROR", error);
      setError(error.message);
    }
  };

  return (
    <main className="bg-gray-950 min-h-screen flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Verify Your Email
        </h1>
        <p className="text-gray-400 mb-6">
          Please check your inbox and click the verification link to activate
          your account. If you didn&apos;t receive the email, you can resend it
          below.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={userData?.email}
          className="w-full p-3 rounded-md mb-4 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleResend}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition"
        >
          Send OTP
        </button>

        {error && <p className="mt-4 text-green-400 font-medium">{error}</p>}
      </div>
    </main>
  );
};

export default VerifyEmail;
