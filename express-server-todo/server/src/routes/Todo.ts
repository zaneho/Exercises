import express, { Request, Response } from "express";
import { ValidationError } from "../helpers/Errors";
import { validateTodo } from "../helpers/functions";
import { authenticateToken } from "../middlewares/Jwt";
import Todo from "../models/Todo";

const router = express.Router();
const TodoModel = new Todo();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { decoded } = req.body;
    const { id: userid } = decoded;

    const result = await TodoModel.getAll(userid);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json(e.message);
  }
});

router.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { decoded } = req.body;
    const { id: userid } = decoded;

    const id = parseInt(req.params.id);
    if (isNaN(id)) throw TypeError("Invalid params");

    const result = await TodoModel.getById(id, userid);
    res.json(result.rows);
  } catch (e) {
    if (e instanceof TypeError) {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { decoded, description } = req.body;
    const { id: userid } = decoded;

    const { error } = validateTodo({ description });
    if (error) throw new ValidationError(error.details[0].message);

    const result = await TodoModel.create(description, userid);
    res.status(201).json(result.rows);
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) throw TypeError("Invalid params");

    const { decoded, description } = req.body;
    const { id: userid } = decoded;

    const { error } = validateTodo({ description });
    if (error) throw new ValidationError(error.details[0].message);

    const result = await TodoModel.update(id, description, userid);
    res.json(result.rows);
  } catch (e) {
    if (e instanceof TypeError) {
      return res.status(400).json({ message: e.message });
    }
    if (e instanceof ValidationError) {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw TypeError("Invalid params");

      const { decoded } = req.body;
      const { id: userid } = decoded;

      const result = await TodoModel.delete(id, userid);
      res.json(result.rows);
    } catch (e) {
      if (e instanceof TypeError) {
        return res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: e.message });
    }
  }
);

export default router;
