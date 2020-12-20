import React from "react";
import "./App.css";
import { Counter } from "./features/counter/Counter";
import ToDoList from "./features/todo/ToDoList";

function App() {
  return (
    <div>
      <Counter />
      <ToDoList />
    </div>
  );
}

export default App;
