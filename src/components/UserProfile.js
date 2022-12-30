import React, { useContext } from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

import { account } from "../appwrite/appwriteConfig";

function UserProfile() {
  const { userInfo, setUserInfo, showLoader, hideLoader } =
    useContext(UserContext);
  const navigate = useNavigate();

  // Log out function
  const handleLogOut = async () => {
    showLoader();

    try {
      await account.deleteSession("current").then((response) => {
        navigate("/signIn");
        setUserInfo(null);
      });
    } catch (error) {
      console.log(error);
      toast("Something went wrong", { type: "error" });
    }

    hideLoader();
  };

  return (
    <>
      {userInfo ? (
        <div className="flex flex-row items-center justify-center gap-4 text-violet-600 dark:text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-violet-600 bg-white text-center text-xl font-bold dark:bg-violet-600">
            {userInfo ? userInfo.name[0].toUpperCase() : "?"}
          </div>

          <div
            onClick={handleLogOut}
            className="rounded-3xl px-4 py-2 font-semibold transition-all duration-200 ease-in-out hover:bg-white hover:text-red-600 active:scale-50 dark:hover:bg-red-600 dark:hover:text-white"
          >
            <span className="cursor-pointer">Sign out</span>
            <MdLogout size="1.5rem" className="ml-2 inline-block" />
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center gap-4">
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
        </div>
      )}
    </>
  );
}

export default UserProfile;
