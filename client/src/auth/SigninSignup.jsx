import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adduser } from "../store/userSlice";

const SigninSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authKey, setAuthKey] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthKey((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setAuthKey({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(
          BASE_URL + "/login",
          { email: authKey.email, password: authKey.password },
          { withCredentials: true }
        );
        console.log("Response", res?.data?.data?.user)
        if (res && res.data) {
          dispatch(adduser(res?.data?.data?.user));
          resetForm();
          navigate("/");
        }
      } else {
        const res = await axios.post(
          BASE_URL + "/signup",
          { name: authKey.name, email: authKey.email, password: authKey.password },
          { withCredentials: true }
        );
        if (res && res.data) {
          dispatch(adduser(res.data));
          resetForm();
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "An error occurred during authentication. Please try again."
      );
    }
  };

  return (
    <main className="bg-gray-950 min-h-screen flex flex-col justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <>
            <label className="block mb-2 text-gray-300" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required={!isLogin}
              value={authKey.name}
              onChange={handleChange}
              className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="John"
            />
          </>
        )}

        <label className="block mb-2 text-gray-300" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={authKey.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="you@example.com"
        />

        <label className="block mb-2 text-gray-300" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={authKey.password}
          onChange={handleChange}
          className="w-full p-3 mb-6 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-md transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p
        className="text-gray-400 mt-4 cursor-pointer"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "New user? Sign up here"
          : "Already have an account? Login here"}
      </p>
    </main>
  );
};

export default SigninSignup;
