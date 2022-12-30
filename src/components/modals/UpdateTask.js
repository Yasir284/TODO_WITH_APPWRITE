import React, { useContext, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { UserContext } from "../../context/UserContext";

const containerVarient = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.2, type: "string", stiffness: 120 },
  },
  exit: {
    opacity: 0,
    scale: 0,
    transition: { type: "string", stiffness: 120 },
  },
};

function UpdateTask({ setUpdateModal, updateModal, todoId, todoById }) {
  console.log(updateModal);
  const editTaskRef = useRef();
  const { showLoader, hideLoader } = useContext(UserContext);

  // Edit Task
  const editTask = async () => {
    const newTask = editTaskRef.current.value;

    if (!newTask) {
      return toast("Add task first", { type: "warning" });
    }

    showLoader();

    const { data } = await axios
      .put(`/todo/tasks/updateTask/${updateModal.taskId}`, {
        task: newTask,
      })
      .catch((error) => error.response);

    hideLoader();

    if (!data.success) {
      return toast(data.message, { type: "error" });
    }

    todoById(todoId);
    setUpdateModal({ active: false, taskId: null });
    toast("Task edited successfully", { type: "info" });
  };

  return (
    <AnimatePresence>
      {updateModal.active && (
        <div className="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-white bg-opacity-10 text-white backdrop-blur-sm dark:bg-black dark:bg-opacity-10">
          <motion.div
            key={updateModal.active}
            variants={containerVarient}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex w-96 flex-col items-center rounded-3xl bg-violet-700 p-10 shadow-lg shadow-slate-500 dark:bg-black-700 dark:shadow-black"
          >
            <MdClose
              size="1.5rem"
              className="absolute top-6 right-10"
              onClick={() => setUpdateModal({ active: false, taskId: null })}
            />

            <h1 className="mb-10 w-full border-b-2 pb-2 text-center text-2xl font-bold dark:border-black-500">
              Edit Task
            </h1>
            <div className="w-full">
              <input
                ref={editTaskRef}
                type="text"
                placeholder="Edit Task"
                className="mb-10 w-full border-b-2 bg-transparent text-xl placeholder:text-white"
              />

              <div className="flex flex-row items-center justify-center gap-4 font-semibold">
                <button
                  onClick={editTask}
                  className="w-full rounded-md border-2 border-white px-4 py-1 transition-all duration-200 ease-in-out hover:bg-white hover:text-violet-600 active:scale-50 dark:hover:text-black"
                >
                  Update Task
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default UpdateTask;
