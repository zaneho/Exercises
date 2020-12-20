import { createSlice } from "@reduxjs/toolkit";
import { counterSlice } from "../counter/counterSlice";

export const todoListSlice = createSlice({
  name: "todoList",
  initialState: [],
  reducers: {
    add: {
      reducer(state, action) {
        const { id, text } = action.payload;
        state.push({ id, text, completed: false });
      },
    },
  },
});

export const { add } = counterSlice.actions;
export const selectTodos = (state) => state.todoList;
export default todoListSlice.reducer;
