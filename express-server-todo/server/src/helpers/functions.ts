import Joi from "joi";
import jwt from "jsonwebtoken";

export function validateTodo(todo: any) {
  const schema = Joi.object({
    description: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(todo);
}

export function validateUser(user: any) {
  const schema = Joi.object({
    id: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(user);
}

export function generateAccessToken(payload: string | object | Buffer) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 300,
  });
}

export function generateRefreshToken(payload: string | object | Buffer) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
}

export function generateTokenPair(payload: string | object | Buffer) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}
