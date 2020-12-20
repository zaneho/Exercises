import express from "express";
import authRouteHandler from "./routes/Auth";
import todoRouteHandler from "./routes/Todo";
import userRouteHandler from "./routes/User";

const app = express();
app.use(express.json());

app.use("/todo", todoRouteHandler);
app.use("/user", userRouteHandler);
app.use("/auth", authRouteHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

//curl -i localhost:5000/todo
//curl -i -d @todo-req.json -H "Content-Type: application/json" localhost:5000/todo
//curl -i -X PUT -d @todo-req.json -H "Content-Type: application/json" localhost:5000/todo/2
//curl -i -X DELETE localhost:5000/todo/2

//curl -i -d @user-req.json -H "Content-Type: application/json" localhost:5000/auth/login
//curl -i -H "Authorization: Bearer <>" localhost:5000/todo
//curl -i -H "Content-Type: application/json" -d @todo-req.json -H "Authorization: Bearer <>" localhost:5000/todo
