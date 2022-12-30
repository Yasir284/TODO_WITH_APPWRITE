import axios from "axios";
import React, { useRef, useState, useContext } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
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

function AddTodo({ showAddTodo, setShowAddTodo, setTodos, todos }) {
  const titleRef = useRef();
  const taskRef = useRef();
  const [tasks, setTasks] = useState([]);
  const { showLoader, hideLoader } = useContext(UserContext);

  // Create Todo
  const createTodo = async () => {
    const title = titleRef.current.value;
    const data = {
      title,
      tasks,
    };
    console.log(data);

    showLoader();

    const todo = await axios
      .post("/todo/createTodo", data)
      .catch((error) => error.response);
    console.log(todo);

    hideLoader();

    if (!todo.data.success) {
      return toast(todo.data.message, { type: "error" });
    }

    setTodos([...todos, todo.data.todo]);

    toast(todo.data.message, { type: "success" });

    titleRef.current.value = "";
    taskRef.current.value = "";
    setTasks([]);
  };

  // Add Task
  const addTask = (e) => {
    e.preventDefault();
    const newTask = { task: taskRef.current.value, taskCreatedAt: Date.now() };

    if (!newTask.task) {
      return toast("Cann't add empty task", { type: "warning" });
    }

    setTasks([...tasks, newTask]);

    taskRef.current.value = "";
  };

  // Delete Task
  const deleteTask = (index) => {
    const updateTasks = tasks.filter((e, i) => i !== index);
    console.log(updateTasks);

    setTasks(updateTasks);
  };

  return (
    <AnimatePresence>
      {showAddTodo && (
        <div className="fixed top-0 left-0 z-40 flex h-full w-full items-center justify-center bg-white text-white backdrop-blur-sm dark:bg-black dark:bg-opacity-10">
          <motion.div
            key={showAddTodo}
            variants={containerVarient}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative flex flex-col items-center rounded-3xl bg-violet-700 p-10 shadow-lg shadow-slate-500 dark:bg-black-700 dark:shadow-black"
          >
            <h1 className="mb-10 w-full border-b-2 pb-2 text-center text-2xl font-bold dark:border-black-500">
              Create Todo
            </h1>

            <MdClose
              onClick={() => setShowAddTodo(false)}
              className="absolute top-6 right-8 active:scale-50"
              size="1.5rem"
            />

            <form className="flex w-full flex-col items-center justify-center gap-4">
              <input
                ref={titleRef}
                type="text"
                placeholder="Todo Title"
                className="w-full border-b-2 bg-transparent text-xl text-white placeholder-white"
              />

              <div className="mb-4 flex w-full flex-row items-center gap-2 rounded-3xl border-2 border-white bg-white pl-4 dark:bg-black-500">
                <MdAdd
                  size="1.5rem"
                  className="text-violet-600 dark:text-white"
                />
                <input
                  ref={taskRef}
                  type="text"
                  placeholder="Add Task"
                  className="w-64 bg-transparent py-1 text-black dark:text-white"
                />
                <button
                  type="submit"
                  onClick={addTask}
                  className="rounded-3xl bg-violet-600 px-6 py-2 font-semibold text-white transition-all duration-200 ease-in-out hover:scale-110 active:scale-75 dark:bg-violet-600 dark:text-white"
                >
                  Add
                </button>
              </div>
            </form>

            <ul className="mb-4 h-72 w-full overflow-y-auto rounded-md border-2 border-white p-2">
              {tasks.length > 0 ? (
                tasks.map((e, index) => (
                  <li
                    key={index}
                    className="mb-2 flex flex-row items-center justify-between gap-2 rounded-md border-2 border-white py-1 px-4"
                  >
                    <p className="w-72 break-words">{e.task}</p>
                    <RiDeleteBin6Line
                      onClick={() => deleteTask(index)}
                      className="text-red-600"
                      size="1.5rem"
                    />
                  </li>
                ))
              ) : (
                <p className="mt-4 text-center">No tasks added</p>
              )}
            </ul>

            <button
              onClick={createTodo}
              className="w-full rounded-md border-2 border-white py-1 transition-all duration-200 ease-in-out hover:bg-white hover:text-violet-600 active:scale-95 dark:hover:text-black"
            >
              Create Todo
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddTodo;
