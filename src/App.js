import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

// Contexts
import { ThemeContext } from "./context/ThemeContext";
import { UserContext } from "./context/UserContext";

// Components
import Loader from "./components/modals/Loader";
const MainSection = lazy(() => import("./components/MainSection"));
const Navbar = lazy(() => import("./components/Navbar"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const TasksSection = lazy(() => import("./components/TasksSection"));

function App() {
  const [theme, setTheme] = useState("dark");
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loader, setLoader] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Show loader function
  const showLoader = () => {
    setLoader(true);
  };
  // Hide loader function
  const hideLoader = () => {
    setLoader(false);
  };

  // Check if user is signed in
  // const checkIsSignedIn = async () => {
  //   const { data } = await axios
  //     .get("/todo/u/isSignedIn")
  //     .catch((error) => error.response);
  //   console.log("signIn response:", data);

  //   if (!data.success) {
  //     setIsSignedIn(false);
  //     return toast("Sign in/Sign up first", { type: "warning" });
  //   }

  //   setUserInfo(data.user);
  //   setIsSignedIn(true);
  // };

  // useEffect(() => {
  //   checkIsSignedIn();
  // }, [setIsSignedIn]);

  return (
    <>
      <UserContext.Provider
        value={{
          isSignedIn,
          setIsSignedIn,
          userInfo,
          setUserInfo,
          showLoader,
          hideLoader,
        }}
      >
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme={theme === "dark" ? "dark" : "light"}
          />
          <Navbar />

          {loader && <Loader />}

          <AnimatePresence>
            <Suspense fallback={<Loader />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainSection />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/tasks/:todoId" element={<TasksSection />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
