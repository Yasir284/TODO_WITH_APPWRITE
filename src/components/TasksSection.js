import React, { useState, useRef, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";

import {
  MdAdd,
  MdArrowBackIosNew,
  MdArrowForwardIos,
  MdCheckCircle,
  MdClose,
  MdColorLens,
  MdCreateNewFolder,
  MdEditNote,
  MdKeyboardArrowRight,
  MdMoreHoriz,
  MdOutlineCircle,
  MdOutlineDelete,
  MdSearch,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import { BiInfoCircle } from "react-icons/bi";
import { RiDeleteBin6Line, RiEditBoxLine } from "react-icons/ri";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import UpdateTask from "./modals/UpdateTask";
import { UserContext } from "../context/UserContext";
import { databases } from "../appwrite/appwriteConfig";
import { Query } from "appwrite";
import { v4 as uuidv4 } from "uuid";

const DATABASE_ID = process.env.REACT_APP_DATABASE_ID;
const TODO_COLLECTION_ID = process.env.REACT_APP_TODO_COLLECTION_ID;
const TASK_COLLECTION_ID = process.env.REACT_APP_TASK_COLLECTION_ID;

const taskUlVarient = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0 },
};

const containerVarient = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
  exit: { opacity: 0 },
};

export default function TasksSection() {
  const location = useLocation();
  const state = location.state;

  const [title, setTitle] = useState(state.todoTitle);
  const [active, setActive] = useState(false);
  const [showInProgress, setShowInProgress] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [tasks, setTasks] = useState(null);
  const [changeTitle, setChangeTitle] = useState(false);
  const [todoTheme, setTodoTheme] = useState(state.theme);

  const { userInfo, showLoader, hideLoader } = useContext(UserContext);

  const taskRef = useRef();
  const titleRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();

  // Getting tasks by todo id
  const getTasks = async (state) => {
    const promise = databases.listDocuments(DATABASE_ID, TASK_COLLECTION_ID, [
      Query.equal("todoId", state.todoId),
    ]);

    promise.then(
      function (response) {
        console.log(response.documents);
        setTasks(response.documents);
      },
      function (error) {
        console.log(error);
        toast("Not able to get tasks", { type: "error" });
      }
    );
  };

  // Rename todo
  const handleRename = async (e) => {
    e.preventDefault();

    showLoader();
    const promise = databases.updateDocument(
      DATABASE_ID,
      TODO_COLLECTION_ID,
      state.todoId,
      { title: titleRef.current.value }
    );

    promise.then(
      function (response) {
        console.log(response);

        setTitle(titleRef.current.value);
        titleRef.current.value = "";
        setChangeTitle(false);
        toast("Title Updated", { type: "success" });
      },
      function (error) {
        console.log(error);
        toast("Failed to update title", { type: "error" });
      }
    );

    hideLoader();
  };

  // Delete todo
  const deleteTodo = async () => {
    let text = "Are you sure you want to delete entire todo?";

    if (!window.confirm(text)) {
      return;
    }

    showLoader();

    const promise = databases.deleteDocument(
      DATABASE_ID,
      TODO_COLLECTION_ID,
      state.todoId
    );

    promise.then(
      function (response) {
        console.log(response);

        deleteAllTasks();
        toast("Todo deleted", { type: "info" });
      },
      function (error) {
        console.log(error);
        toast("Failed to delete todo", { type: "error" });
      }
    );

    hideLoader();
    navigate("/");
    window.location.reload();
  };

  const deleteAllTasks = async () => {
    if (tasks.length <= 0) return;

    tasks.forEach(
      (task) => {
        const promise = databases.deleteDocument(
          DATABASE_ID,
          TASK_COLLECTION_ID,
          task.$id
        );

        promise.then(function (res) {
          console.log(res);
        });
      },
      function (err) {
        console.log(err);
      }
    );
  };

  // Add Task
  const addTask = async (e) => {
    e.preventDefault();

    showLoader();

    const task = taskRef.current.value;

    if (!task) {
      return toast("Cann't add empty task", { type: "warning" });
    }

    const promise = databases.createDocument(
      DATABASE_ID,
      TASK_COLLECTION_ID,
      uuidv4(),
      { task, userId: userInfo.$id, todoId: state.todoId }
    );

    promise.then(
      function (response) {
        console.log(response);

        taskRef.current.value = "";
        getTasks(state, userInfo);
        toast("New todo added", { type: "info" });
      },
      function (error) {
        console.log(error);
        toast("Something went wrong", { type: "error" });
      }
    );

    hideLoader();
  };

  // Update Theme
  const updateTheme = async (theme) => {
    showLoader();

    const promise = databases.updateDocument(
      DATABASE_ID,
      TODO_COLLECTION_ID,
      state.todoId,
      { todoTheme: theme }
    );

    promise.then(
      function (response) {
        console.log(response);
        setTodoTheme(response.todoTheme);
        toast("Todo theme changed", { type: "info" });
      },
      function (error) {
        console.log(error);
        toast("Failed to change theme", { type: "error" });
      }
    );

    hideLoader();
  };

  // Search Todo
  const handleSearch = async (e) => {
    e.preventDefault();

    showLoader();

    let search = searchRef.current.value;

    if (!search || search === "") {
      getTasks(state, userInfo.$id);
      return hideLoader();
    }

    const promise = databases.listDocuments(DATABASE_ID, TASK_COLLECTION_ID, [
      Query.search("task", search),
    ]);

    promise.then(
      function (response) {
        console.log(response.documents);
        let data = response.documents.filter(
          (task) => task.todoId === state.todoId
        );
        setTasks(data);
      },
      function (error) {
        console.log(error);
        toast("Task not found", { type: "info" });
      }
    );

    hideLoader();
  };

  useEffect(() => {
    getTasks(state);
  }, [state]);

  const selectTheme = [
    {
      style:
        "shadow-lg shadow-slate-400 dark:shadow-black active:scale-50 hover:scale-125 transition-all ease-in-out duration-200 w-6 h-6 rounded-full bg-violet-600",
      changeTheme: () => updateTheme("violet"),
    },
    {
      style:
        "shadow-lg shadow-slate-400 dark:shadow-black active:scale-50 hover:scale-125 transition-all ease-in-out duration-200 w-6 h-6 rounded-full bg-red-600",
      changeTheme: () => updateTheme("red"),
    },
    {
      style:
        "shadow-lg shadow-slate-400 dark:shadow-black active:scale-50 hover:scale-125 transition-all ease-in-out duration-200 w-6 h-6 rounded-full bg-split-white-black",
      changeTheme: () => updateTheme("black-white"),
    },
  ];

  return (
    <motion.div
      variants={containerVarient}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`relative flex flex-row justify-center ${
        todoTheme
          ? todoTheme === "black-white"
            ? "text-black dark:text-white"
            : `text-${todoTheme}-600`
          : "text-violet-600 dark:text-white"
      }`}
    >
      <div className="w-full bg-violet-50 p-6 dark:bg-black-900 xs:py-12 sm:px-36">
        {/**********HEADING***********/}
        <div className="mb-12 flex flex-row items-center justify-between border-b-2 pb-2">
          <div className="flex flex-row items-center gap-6">
            {changeTitle ? (
              <form
                onSubmit={handleRename}
                className="flex h-10 flex-row items-center rounded-3xl bg-white px-4 shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black"
              >
                <MdAdd size="1.5rem" type="submit" />
                <input
                  ref={titleRef}
                  placeholder="Add new title"
                  className="bg-transparent p-2"
                />
                <MdClose onClick={() => setChangeTitle(false)} size="1.5rem" />
              </form>
            ) : (
              <h1 className="text-3xl font-extrabold">
                {title ? title : "Title"}
              </h1>
            )}

            <div className="relative">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white dark:hover:bg-black-700"
                onClick={() => setActive(!active)}
              >
                {active ? (
                  <MdClose size="1.2rem" />
                ) : (
                  <MdMoreHoriz size="1.2rem" />
                )}
              </button>

              <ul
                className={`absolute left-0 top-8 cursor-pointer flex-col items-start justify-center rounded-md bg-white text-sm shadow-md shadow-slate-400 dark:bg-black-700 dark:shadow-black ${
                  active ? "flex" : "hidden"
                }`}
              >
                <li
                  onClick={() => {
                    setChangeTitle(true);
                    setActive(false);
                  }}
                  className="flex w-52 flex-row items-center gap-4 rounded-md py-4 pl-6 text-black transition-all duration-200 ease-in-out hover:bg-white-50  dark:text-white dark:hover:bg-black-500"
                >
                  <MdEditNote size="1.2rem" />
                  <span>Rename List</span>
                </li>

                <li className="group flex w-52 flex-row items-center gap-4 rounded-md py-4 pl-6 text-black transition-all duration-200 ease-in-out hover:bg-white-50 dark:text-white dark:hover:bg-black-500">
                  <MdColorLens size="1.2rem" />
                  <span>Change Theme</span>
                  <MdKeyboardArrowRight size="1.2rem" />

                  <div className="absolute top-12 -right-[136px] hidden cursor-pointer flex-row gap-4 rounded-md bg-white px-4 py-4 shadow-md shadow-slate-400 group-hover:flex dark:bg-black-700 dark:shadow-black">
                    {selectTheme.map(({ style, changeTheme }, index) => {
                      return (
                        <div
                          key={index}
                          className={style}
                          onClick={changeTheme}
                        ></div>
                      );
                    })}
                  </div>
                </li>

                <li
                  onClick={deleteTodo}
                  className="flex w-52 flex-row items-center gap-4 rounded-md py-4 pl-6 text-red-600 transition-all duration-200 ease-in-out hover:bg-white-50 dark:hover:bg-black-500"
                >
                  <MdOutlineDelete size="1.2rem" />
                  <span>Delete List</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Search tasks */}
          <div className="flex flex-row items-center gap-6">
            <form
              onSubmit={handleSearch}
              className="flex h-10 flex-row items-center gap-6 rounded-3xl bg-white px-4 shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black"
            >
              <input
                ref={searchRef}
                className="w-36 bg-transparent xs:w-40"
                type="search"
                placeholder="Search task"
              />
              <MdSearch type="submit" size="1.5rem" />
            </form>
          </div>
        </div>

        {/* Add Task form */}
        <form className="flex flex-row gap-6" onSubmit={addTask}>
          <input
            ref={taskRef}
            type="text"
            className="w-full rounded-md bg-white p-3 shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black"
            placeholder="Add task"
          />

          <button
            type="submit"
            className="ml-4 rounded-md bg-white px-4 py-[5px] shadow-md shadow-slate-200 transition-all duration-200 ease-in-out active:scale-50 dark:bg-black-700 dark:shadow-black"
          >
            Add
          </button>
        </form>

        {/* Tasks In Progress */}
        <motion.div className="mt-10 cursor-pointer">
          <div
            onClick={() => setShowInProgress(!showInProgress)}
            className="flex flex-row items-center gap-4 border-b-2 pb-1 font-semibold dark:border-black-500"
          >
            <MdArrowForwardIos
              className={`${
                showInProgress ? "rotate-90" : ""
              } transition-all duration-200 ease-in-out`}
              size="1.5rem"
            />
            <p>In Progress</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black">
              {tasks ? tasks.filter((e) => !e.isCompleted).length : 0}
            </div>
          </div>

          <ResizeablePanel>
            {showInProgress ? (
              <motion.ul variants={taskUlVarient} className="my-6">
                {tasks && tasks.length > 0
                  ? tasks
                      .filter((e) => !e.isCompleted)
                      .sort(
                        (a, b) => Number(b.isImportant) - Number(a.isImportant)
                      )
                      .map((e) => (
                        <TaskList
                          e={e}
                          getTasks={getTasks}
                          todoId={state.todoId}
                          todoTheme={todoTheme}
                          userId={userInfo.$id}
                        />
                      ))
                  : ""}
              </motion.ul>
            ) : (
              ""
            )}
          </ResizeablePanel>
        </motion.div>

        {/* Tasks Completed */}
        <motion.div className="mt-10 cursor-pointer">
          <div
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex flex-row items-center gap-4 border-b-2 pb-1 font-semibold  dark:border-black-500"
          >
            <MdArrowForwardIos
              className={`${
                showCompleted ? "rotate-90" : ""
              } transition-all duration-200 ease-in-out`}
              size="1.5rem"
            />
            <p>Completed</p>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black">
              {tasks ? tasks.filter((e) => e.isCompleted).length : 0}
            </div>
          </div>

          <ResizeablePanel>
            {showCompleted && (
              <motion.ul
                key={showCompleted}
                variants={taskUlVarient}
                className="my-6"
              >
                {tasks && tasks.length > 0
                  ? tasks
                      .filter((e) => e.isCompleted)
                      .map((e) => (
                        <TaskList
                          e={e}
                          getTasks={getTasks}
                          state={state}
                          todoTheme={todoTheme}
                          userId={userInfo.$id}
                        />
                      ))
                  : ""}
              </motion.ul>
            )}
          </ResizeablePanel>
        </motion.div>
      </div>

      {/* Back button */}
      <NavLink
        to="/"
        className={`fixed left-[5%] top-[50%] my-auto hidden rounded-full border-2 p-3 shadow-md shadow-slate-200 transition-all duration-200 ease-in-out hover:bg-violet-600 hover:text-white dark:text-white dark:shadow-black dark:hover:bg-white dark:hover:text-black sm:block`}
      >
        <MdArrowBackIosNew size="1.5rem" />
      </NavLink>
    </motion.div>
  );
}

// Task list parent container
function ResizeablePanel({ children }) {
  const [ref, { height }] = useMeasure();
  return (
    <motion.div
      animate={{ height, transition: { ease: "easeOut", duration: 0.3 } }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
}

// Task list items component
function TaskList({ e, getTasks, todoTheme }) {
  const location = useLocation();
  const state = location.state;
  const [ref, { height }] = useMeasure();
  const { showLoader, hideLoader } = useContext(UserContext);
  const [updateModal, setUpdateModal] = useState({
    active: false,
    taskId: null,
  });

  // Complete Task
  const handleIsCompleted = async (isCompleted, taskId) => {
    showLoader();

    const promise = databases.updateDocument(
      DATABASE_ID,
      TASK_COLLECTION_ID,
      taskId,
      { isCompleted: !isCompleted }
    );

    promise.then(
      function (response) {
        console.log("isCompleted res:", response);
        getTasks(state);
      },
      function (error) {
        console.log(error);
        toast("Cann't update task", { type: "error" });
      }
    );

    hideLoader();
  };

  // Important Task
  const handleIsImportant = async (isImportant, taskId) => {
    showLoader();

    const promise = databases.updateDocument(
      DATABASE_ID,
      TASK_COLLECTION_ID,
      taskId,
      { isImportant: !isImportant }
    );

    promise.then(
      function (response) {
        console.log(response);
        getTasks(state);
      },
      function (error) {
        console.log(error);
        toast("Cann't update task", { type: "error" });
      }
    );

    hideLoader();
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    showLoader();
    const promise = databases.deleteDocument(
      DATABASE_ID,
      TASK_COLLECTION_ID,
      taskId
    );

    promise.then(
      function (response) {
        console.log(response);
        getTasks(state);
      },
      function (error) {
        console.log(error);
        toast("Cann't delete task", { type: "error" });
      }
    );
    hideLoader();
  };

  return (
    <motion.li
      key={e.$id}
      animate={{
        height,
        transition: { ease: "easeOut", duration: 0.3 },
      }}
      layoutId={e.$id}
      className="mb-3 rounded-md bg-white shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black"
    >
      <motion.div ref={ref}>
        <div
          className={`${
            e.isCompleted ? "line-through" : ""
          } flex flex-row justify-between rounded-md border-b-2 border-transparent px-4 py-3`}
        >
          <div className="flex flex-row items-center gap-2">
            {e.isCompleted ? (
              <MdCheckCircle
                onClick={() => handleIsCompleted(e.isCompleted, e.$id)}
                className="min-w-[1.5rem]"
                size="1.4rem"
              />
            ) : (
              <MdOutlineCircle
                onClick={() => handleIsCompleted(e.isCompleted, e.$id)}
                className="min-w-[1.5rem]"
                size="1.4rem"
              />
            )}
            <p>{e.task}</p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="group relative active:scale-90">
              <BiInfoCircle size="1.5rem" />

              <ul className="absolute bottom-10 -right-28 hidden w-[22rem] flex-col rounded-md bg-white  px-4 py-2 text-xs text-slate-500 shadow-md shadow-slate-200 group-active:flex dark:bg-black-800 dark:text-white dark:shadow-black">
                <li className="mb-2 flex flex-row items-center gap-2 border-b-2 pb-2 pr-5 dark:border-black-500">
                  <MdCreateNewFolder size="1.5rem" />
                  <span>
                    Created at : {new Date(e.$createdAt).toDateString()}
                    {", "}
                    {new Date(e.$createdAt).toLocaleTimeString()}
                  </span>
                </li>

                <li className="flex flex-row items-center gap-2">
                  <MdEditNote size="1.5rem" />
                  <span>
                    Updated at : {new Date(e.updatedAt).toDateString()}
                    {", "}
                    {new Date(e.updatedAt).toLocaleTimeString()}
                  </span>
                </li>
              </ul>
            </div>

            <RiEditBoxLine
              onClick={() => {
                setUpdateModal({
                  active: true,
                  taskId: e.$id,
                });
              }}
              title="Edit Task"
              className="text-emerald-400 active:scale-90"
              size="1.5rem"
            />
            <RiDeleteBin6Line
              onClick={() => deleteTask(e.$id)}
              title="Delete Task"
              className="text-red-400 active:scale-90"
              size="1.5rem"
            />
            {e.isImportant ? (
              <MdStar
                onClick={() => handleIsImportant(e.isImportant, e.$id)}
                size="1.5rem"
                className={`dark:text-white text-${todoTheme} active:scale-90`}
              />
            ) : (
              <MdStarOutline
                onClick={() => handleIsImportant(e.isImportant, e.$id)}
                size="1.5rem"
                className={`dark:text-white text-${todoTheme} active:scale-90`}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Update Task Modal */}
      <UpdateTask
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        state={state}
        getTasks={getTasks}
      />
    </motion.li>
  );
}
