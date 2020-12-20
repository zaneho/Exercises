import express, { Request, Response } from "express";
import { ValidationError } from "../helpers/Errors";
import { generateTokenPair, validateUser } from "../helpers/functions";
import User from "../models/User";
const router = express.Router();
const UserModel = new User();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { error } = validateUser(req.body);
    if (error) throw new ValidationError(error.details[0].message);
    const { id, password } = req.body;

    const idExist = await UserModel.getById(id);
    if (idExist.rowCount)
      return res.json({ message: "This id is taken. Try another." });

    const { accessToken, refreshToken } = generateTokenPair({ id });
    await UserModel.create(id, password, refreshToken);
    return res.status(201).json({ accessToken, refreshToken });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

export default router;
