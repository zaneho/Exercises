import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import todoListReducer from "../features/todo/todoListSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    todoList: todoListReducer,
  },
});
