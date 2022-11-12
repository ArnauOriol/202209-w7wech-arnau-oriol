import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import type { RegisterData } from "../../types/types";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, picture } = req.body as RegisterData;

  try {
    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: passwordHashed,
      picture,
    });

    res
      .status(201)
      .json({ user: { id: newUser._id, username, picture, email } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Error on registration"
    );

    next(customError);
  }
};

export default registerUser;
