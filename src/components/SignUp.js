import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { MdArrowBackIosNew, MdVerticalAlignBottom } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { account } from "../appwrite/appwriteConfig";
import { v4 as uuidv4 } from "uuid";

const containerVarient = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.5 } },
  exit: { opacity: 0 },
};

function SignUp() {
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPass, setShowPass] = useState(false);
  const { showLoader, hideLoader } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let name = nameRef.current.value;
    let email = emailRef.current.value;
    let password = passwordRef.current.value;

    if (!(name && email && password)) {
      return toast("All fields are mandatory", { type: "error" });
    }

    showLoader();

    const promise = await account
      .create(uuidv4(), email, password, name)
      .then((response) => {
        console.log(response);
        toast("Account created successfully", { type: "success" });
        nameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
        navigate("/signIn");
      })
      .catch((err) => {
        console.log(err);
        toast("Something went wrong", { type: "error" });
      });

    hideLoader();
  };

  return (
    <motion.div
      variants={containerVarient}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-[80vh] w-full items-center justify-center bg-violet-50 text-white dark:bg-black-900 xs:h-[89vh]"
    >
      <div className="flex flex-col items-center rounded-3xl bg-violet-600 p-10 shadow-lg shadow-slate-500 dark:bg-black-700 dark:shadow-black">
        <h1 className="mb-10 w-full border-b-2 pb-2 text-center text-2xl font-bold dark:border-black-500">
          Sign Up
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-96 flex-col items-start"
        >
          <label htmlFor="fullName" className="ml-2 mb-2">
            Full Name:
          </label>
          <input
            ref={nameRef}
            type="text"
            name="fullName"
            placeholder="Enter full name"
            className="mb-8 w-full rounded-3xl bg-[#e8f0fe] p-2 px-4 text-black "
          />

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
              className="bg-[#e8f0fe] text-black"
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

          <div className="flex w-full flex-row justify-center gap-4">
            <NavLink
              to="/"
              className="rounded-full border-2 border-white p-3 transition-all duration-200 ease-in-out hover:bg-white hover:text-violet-600 dark:hover:text-black"
            >
              <MdArrowBackIosNew size="1.5rem" />
            </NavLink>
            <button
              type="submit"
              className="rounded-3xl bg-white px-4 py-3 font-semibold text-violet-600 transition-all duration-200 ease-in-out hover:scale-110 active:scale-50 dark:bg-violet-600 dark:text-white"
            >
              Create account
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-xs">
          <span className="mr-3">Already have an account?</span>
          <NavLink to="/signIp" className="border-b-2">
            sign in
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
}

export default SignUp;
