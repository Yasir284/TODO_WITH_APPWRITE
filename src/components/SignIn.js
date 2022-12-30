import React, { useRef, useState, useContext } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MdArrowBackIosNew } from "react-icons/md";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";

const containerVarient = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.5 } },
  exit: { opacity: 0 },
};

function SignIn() {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPass, setShowPass] = useState(false);
  const { setIsSignedIn, setUserInfo, showLoader, hideLoader } =
    useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let email = emailRef.current.value;
    let password = passwordRef.current.value;

    if (!(email && password)) {
      return toast("All fields are mandatory", { type: "error" });
    }

    const data = {
      email,
      password,
    };

    showLoader();

    const request = await axios.post("todo/u/signIn", data).catch((error) => {
      return error.response;
    });
    console.log(request);

    hideLoader();

    if (!request.data.success) {
      return toast(request.data.message, { type: "error" });
    }

    toast(request.data.message, { type: "success" });

    let token = "Bearer " + request.data.token;

    sessionStorage.setItem("bearerToken", token);

    setIsSignedIn(true);
    setUserInfo(request.data.user);
    emailRef.current.value = "";
    passwordRef.current.value = "";

    navigate("/");
    window.location.reload();
  };

  return (
    <motion.div
      variants={containerVarient}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-[80vh] w-full items-center justify-center bg-violet-50 text-white dark:bg-black-900"
    >
      <div className="flex flex-col items-center rounded-3xl bg-violet-600 p-10 shadow-lg shadow-slate-500 dark:bg-black-700 dark:shadow-black">
        <h1 className="mb-10 w-full border-b-2 pb-2 text-center text-2xl font-bold dark:border-black-500">
          Sign In
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-96 flex-col items-start"
        >
          <label htmlFor="email" className="ml-2 mb-2">
            Email:
          </label>
          <input
            ref={emailRef}
            type="email"
            name="email"
            placeholder="example@gmail.com"
            className="mb-8 w-full rounded-3xl bg-[#e8f0fe] p-2 px-4 text-black"
          />

          <label htmlFor="password" className="ml-2 mb-2">
            Password:
          </label>
          <div className="felx-row mb-8 flex w-full justify-between rounded-3xl bg-[#e8f0fe] p-2 px-4">
            <input
              ref={passwordRef}
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              className="bg-white text-black dark:bg-black-500 dark:text-white"
            />
            {showPass ? (
              <FaEye
                className="text-slate-500"
                size="1.5rem"
                onClick={() => setShowPass(false)}
              />
            ) : (
              <FaEyeSlash
                className="text-slate-500"
                size="1.5rem"
                onClick={() => setShowPass(true)}
              />
            )}
          </div>
          <div className="mt-6 flex w-full flex-row items-center justify-center gap-6">
            <NavLink
              to="/"
              className="rounded-full border-2 border-white p-3 transition-all duration-200 ease-in-out hover:bg-white hover:text-violet-600 dark:hover:text-black"
            >
              <MdArrowBackIosNew size="1.5rem" />
            </NavLink>
            <button
              type="submit"
              className="rounded-3xl bg-white px-6 py-3 font-semibold text-violet-600 transition-all duration-200 ease-in-out hover:scale-110 active:scale-50 dark:bg-violet-600 dark:text-white"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-3 text-center text-xs">
          <span className="mr-3">Don't have an account?</span>
          <NavLink to="/signUp" className="border-b-2">
            sign up
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
}

export default SignIn;
