import React, { useEffect, useState } from "react";
import "./ProgressBar.css";
import { motion } from "framer-motion";
import { MdCheck } from "react-icons/md";

function ProgressBar({ percentage }) {
  const [count, setCount] = useState(0);

  // Loading percentage
  useEffect(() => {
    let startCount = 0;
    setCount(startCount);
    function loadPercent(percentage) {
      let interval = setInterval(() => {
        if (startCount === Math.round(percentage)) {
          return clearInterval(interval);
        }
        startCount += 1;
        setCount(startCount);
      }, 20);
    }
    loadPercent(percentage);
  }, [percentage]);

  return (
    <div className="relative h-[10rem] w-[10rem] ">
      <div className="flex h-full w-full items-center justify-center rounded-full bg-violet-50 bg-transparent p-3 shadow-xl shadow-slate-500 dark:bg-black-700 dark:shadow-black">
        <div className="dark:black-900 flex h-full w-full flex-col items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600 shadow-inner shadow-slate-300 dark:bg-black-700 dark:shadow-black-500">
          {percentage < 100 ? (
            <>
              <div className=""></div>
              <div>
                <p className="font text-2xl">{count}%</p>
                <p className="text-sm">Done</p>
              </div>
            </>
          ) : (
            <MdCheck size="5rem" />
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 h-full w-full  ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="top-0 h-full w-full"
        >
          <defs>
            <linearGradient id="GradientColor">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#673ab7" />
            </linearGradient>
          </defs>
          <motion.circle
            initial={{ strokeDashoffset: "28.75rem" }}
            animate={{
              strokeDashoffset: `${28.75 - 28.75 * (percentage / 100)}rem`,
              transition: { ease: "easeInOut", duration: 0.5, delay: 0.6 },
            }}
            cx="5rem"
            cy="5rem"
            r="4.6rem"
            strokeLinecap="round"
            strokeDasharray="28.75rem"
            strokeDashoffset={`${28.75 - 28.75 * (percentage / 100)}rem`}
            strokeWidth="0.75rem"
          />
        </svg>
      </div>
    </div>
  );
}

export default ProgressBar;
