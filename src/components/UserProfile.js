// import axios from "axios";
import axios from "axios";
import React from "react";
import { useContext } from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

function UserProfile() {
  const { setIsSignedIn, userInfo, showLoader, hideLoader } =
    useContext(UserContext);
  const navigate = useNavigate();

  // Log out function
  const handleLogOut = async () => {
    showLoader();

    const res = await axios
      .get("/todo/u/signOut")
      .catch((error) => error.response);
    console.log(res);

    hideLoader();

    if (!res.data.success) {
      return toast(res.data.message, { type: "error" });
    }
    sessionStorage.clear();
    setIsSignedIn(false);
    navigate("/");
  };

  return (
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
  );
}

export default UserProfile;
