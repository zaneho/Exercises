import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ValidationError } from "../helpers/Errors";
import {
  generateAccessToken,
  generateTokenPair,
  validateUser,
} from "../helpers/functions";
import Token from "../models/Token";
import User from "../models/User";
const router = express.Router();
const TokenModel = new Token();
const UserModel = new User();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { error } = validateUser(req.body);
    if (error) throw new ValidationError(error.details[0].message);
    const { id, password } = req.body;

    const getUser = await UserModel.getByIdPw(id, password);
    if (getUser.rowCount) {
      const { accessToken, refreshToken } = generateTokenPair({ id });
      const getToken = await TokenModel.getTokenByUserid(id);
      if (!getToken.rowCount) await TokenModel.create(id, refreshToken);
      else await TokenModel.update(id, refreshToken);
      return res.status(201).json({ accessToken, refreshToken });
    }
    return res.json({ message: "Invalid User ID / Password" });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ message: e.message });
    }
    res.status(500).json({ message: e.message });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);

    const result = await TokenModel.getToken(refreshToken);
    if (!result.rowCount) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err: Error, decoded: any) => {
        const { id } = decoded;
        if (err) return res.status(403).send({ message: err.message });
        const accessToken = generateAccessToken({ id });
        res.json({ accessToken });
      }
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/logout", async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.sendStatus(400);

    const result = await TokenModel.delete(token);
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
