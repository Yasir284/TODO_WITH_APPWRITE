import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import logo from "../images/homework.png";
import UserProfile from "./UserProfile";

function Navbar() {
  const { theme, setTheme } = useContext(ThemeContext);

  const { isSignedIn } = useContext(UserContext);
  return (
    <nav className="sticky top-0 right-0 z-40 backdrop-blur-sm backdrop-filter">
      <div className="border-b-2 bg-violet-800 bg-opacity-20 px-6 py-4 text-violet-600 dark:border-black-500 dark:bg-black dark:bg-opacity-10 dark:text-white xs:px-12 xs:py-4">
        <div className="relative flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-6">
            <div className="flex flex-row items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="w-10 brightness-0 drop-shadow-lg filter dark:filter-none"
              />
              <h1 className="text-2xl font-extrabold">TODO</h1>
            </div>
          </div>

          <ul className="flex flex-row items-center gap-4">
            <li className="flex flex-row items-center gap-2 border-r-2 pr-6 dark:border-black-500">
              <p className="text-xs font-bold">
                Change <br /> Theme
              </p>
              <div
                className="relative inline-block w-12 select-none align-middle transition duration-200 ease-in"
                title="Change Theme"
              >
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  className="toggle-checkbox darkbg-white absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-white transition-all duration-200 ease-in-out dark:border-black-500 dark:bg-violet-600"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
                <label
                  htmlFor="toggle"
                  className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-black-500 shadow-md dark:shadow-black"
                ></label>
              </div>
            </li>

            {isSignedIn ? (
              <UserProfile />
            ) : (
              <>
                <NavLink to="/signUp">
                  <li className="font-semibold transition-all duration-200 ease-in-out active:scale-50">
                    Sign up
                  </li>
                </NavLink>
                <NavLink to="/signIn">
                  <li className="rounded-3xl bg-white px-4 py-2  font-semibold transition-all duration-200 ease-in-out active:scale-50 dark:bg-violet-600">
                    Sign in
                  </li>
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
