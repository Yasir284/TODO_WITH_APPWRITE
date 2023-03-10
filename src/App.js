import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

// Contexts
import { ThemeContext } from "./context/ThemeContext";
import { UserContext } from "./context/UserContext";

// Components
import Loader from "./components/modals/Loader";
import { account } from "./appwrite/appwriteConfig";
const MainSection = lazy(() => import("./components/MainSection"));
const Navbar = lazy(() => import("./components/Navbar"));
const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const TasksSection = lazy(() => import("./components/TasksSection"));

function App() {
  const [theme, setTheme] = useState("dark");
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

  useEffect(() => {
    try {
      const getData = account.get();

      getData.then((response) => {
        console.log(response);
        setUserInfo(response);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <UserContext.Provider
        value={{
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
                <Route path="/tasks" element={<TasksSection />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </ThemeContext.Provider>
      </UserContext.Provider>
    </>
  );
}

export default App;
