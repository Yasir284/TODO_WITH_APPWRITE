import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import AddTodo from "./modals/AddTodo";
import { toast } from "react-toastify";

import { MdAdd, MdCalendarToday, MdSearch } from "react-icons/md";

import ProgressBar from "./ProgressBar/ProgressBar";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";

const containerVarient = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.5 } },
  exit: { opacity: 0 },
};

const todoListvarient = {
  whileHover: { scale: 1.1 },
  transition: { type: "spring", stiffness: 120 },
};

export default function MainSection() {
  const { isSignedIn, showLoader, hideLoader } = useContext(UserContext);
  const [todos, setTodos] = useState(null);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const searchRef = useRef();

  // Getting Todos
  const getTodos = async () => {
    const { data } = await axios
      .get("/todo/getTodos")
      .catch((error) => error.response);
    console.log("todos response:", data);

    if (!data.success) {
      return toast(data.message, { type: "error" });
    }
    setTodos(data.todos);
  };

  // Search Todo
  const handleSearch = async (e) => {
    e.preventDefault();
    let search = searchRef.current.value;

    showLoader();

    if (!search || search === "") {
      getTodos();
      return hideLoader();
    }

    const { data } = await axios
      .post("/todo/searchTodos", { search })
      .catch((error) => error.response);

    hideLoader();

    if (!data.success) {
      return toast("Todo not found", { type: "info" });
    }

    setTodos(data.todos);
  };

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getTodos();
  }, [setTodos, isSignedIn]);

  return (
    <motion.div
      variants={containerVarient}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex w-full justify-center"
    >
      <div className="w-full bg-violet-50 p-6 dark:bg-black-900 xs:px-12 xs:pb-12 sm:px-32">
        {/**********HEADING***********/}
        <div className="mb-12 flex flex-row items-center justify-between border-b-2 border-violet-600 pb-2 text-violet-600 dark:border-white dark:text-white">
          <div className="flex flex-row items-center gap-6">
            <h1 className="text-2xl font-extrabold xs:text-3xl">My Todos</h1>
          </div>

          {/* Search todo */}
          <div className="flex flex-row items-center gap-6">
            <form
              onSubmit={handleSearch}
              className="flex h-10 flex-row items-center rounded-3xl bg-white px-4 shadow-md shadow-slate-200 dark:bg-black-700 dark:shadow-black"
            >
              <input
                ref={searchRef}
                className="max-w-40 w-40 bg-transparent xs:w-auto xs:max-w-none"
                type="search"
                placeholder="Search todo"
              />
              <MdSearch type="button" size="1.5rem" />
            </form>

            <button
              onClick={() => setShowAddTodo(true)}
              className="h-14 w-14 rounded-full bg-white shadow-md shadow-slate-200 transition-all duration-200 ease-out active:scale-50 dark:bg-black-700 dark:shadow-black"
            >
              <MdAdd className="m-auto" size="2.5rem" />
            </button>
          </div>
        </div>

        {/* Add Todo Modal */}
        <AddTodo
          showAddTodo={showAddTodo}
          setShowAddTodo={setShowAddTodo}
          setTodos={setTodos}
          todos={todos}
        />

        {/* Todo List */}
        {isSignedIn && todos && todos.length > 0 ? (
          <ul className="flex w-full flex-row flex-wrap justify-center gap-12">
            {todos.map((todo, i) => (
              <NavLink key={i} to={`/tasks/${todo._id}`}>
                <motion.li
                  {...todoListvarient}
                  layout
                  className="text-violet-700 dark:text-white"
                >
                  <div className="flex w-[80vw] flex-row justify-between rounded-3xl bg-violet-100 p-6 shadow-xl shadow-slate-300 dark:bg-black-700 dark:shadow-black xs:w-auto xs:gap-12 xs:p-10">
                    <div>
                      <h1 className="mb-5 text-2xl font-bold">{todo.title}</h1>
                      <p className="ml-2 mb-1">
                        🚀 <span>{todo.tasks.length}</span> Tasks
                      </p>
                      <p className="ml-2">
                        🔥
                        <span>
                          {todo.tasks.filter((e) => e.isCompleted).length}
                        </span>{" "}
                        Done
                      </p>

                      <div
                        title="Created at"
                        className="ml-2 mt-2 flex w-52 flex-row items-center gap-2 break-words border-t-2 border-slate-300 pt-2 dark:border-black-500 xs:w-64"
                      >
                        <MdCalendarToday />
                        <span>
                          {new Date(todo.created_at).toDateString()}
                          {", "}
                          {new Date(todo.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <ProgressBar
                      percentage={
                        (todo.tasks.filter((e) => e.isCompleted).length * 100) /
                        todo.tasks.length
                      }
                    />
                  </div>
                </motion.li>
              </NavLink>
            ))}
          </ul>
        ) : (
          <ul className="flex w-full flex-row flex-wrap justify-center gap-12">
            {new Array(4).fill("").map((_e, i) => (
              <li key={i} className="flex basis-[45%] flex-row">
                <div className="flex w-full flex-row justify-between gap-12 rounded-3xl bg-white p-10 shadow-xl shadow-slate-300 dark:bg-black-700 dark:shadow-black">
                  <div className="flex animate-pulse flex-col gap-2 ">
                    <div className="mb-2 h-3 w-32 rounded-3xl bg-slate-200 dark:bg-[#706b6b]"></div>
                    <div className="mt-3 flex flex-row items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-[#706b6b]"></div>
                      <div className="h-3 w-28 rounded-3xl bg-slate-200 dark:bg-[#706b6b]"></div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-[#706b6b]"></div>
                      <div className="h-3 w-28 rounded-3xl bg-slate-200 dark:bg-[#706b6b]"></div>
                    </div>
                    <div className="mt-4 flex flex-row items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-[#706b6b]"></div>
                      <div className="h-3 w-48 rounded-3xl bg-slate-200 dark:bg-[#706b6b]"></div>
                    </div>
                  </div>

                  <div className=" h-[10rem] w-[10rem] animate-pulse  rounded-full bg-slate-200 dark:bg-[#706b6b]"></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
