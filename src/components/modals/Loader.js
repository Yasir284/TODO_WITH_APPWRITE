import React from "react";
import { motion } from "framer-motion";
// import { ImSpinner2 } from "react-icons/im";

function Loader() {
  return (
    <motion.div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-white bg-opacity-10 text-white backdrop-blur-sm dark:bg-black dark:bg-opacity-75">
      {/* <ImSpinner2 className="animate-spin" size="2rem" /> */}
      <img
        className="w-28"
        src="https://media.giphy.com/media/rIqUQgjJa5v7Z0gSmD/giphy.gif"
        alt="loading gif"
      />
    </motion.div>
  );
}

export default Loader;
