import { Request, Response } from "express";
import db from "../db";
import { z } from "zod";
import { createPassword, verifyPassword } from "../utility/password";
import { createToken } from "../utility/token";
import { createJwt } from "../utility/jwt";

const LoginZod = z.object({
  username: z.string().regex(/^[a-zA-Z]+$/, "Invalid username format"),
  password: z.string().min(8),
});
export const Login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsedData = LoginZod.parse(req.body);

    const user = await db.user.findUnique({
      where: {
        username: parsedData.username,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "username not found",
      });
    }
    const isPasswordValid = verifyPassword(parsedData.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "password not valid",
      });
    }
    const payload = {
      token: createToken(user.id, user.username),
    };
    return res.json({
      token: createJwt(payload),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const RegisterZod = z.object({
  username: z.string().regex(/^[a-zA-Z]+$/, "Invalid username format"),
  password: z.string().min(8),
});

export const Register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedData = RegisterZod.parse(req.body);

    const existingUser = await db.user.findUnique({
      where: {
        username: parsedData.username,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await createPassword(parsedData.password);

    const newUser = await db.user.create({
      data: {
        username: parsedData.username,
        password: hashedPassword,
      },
    });
    const payload = {
      token: createToken(newUser.id, newUser.username),
    };
    return res.status(201).json({
      message: "User registered successfully",
      token: createJwt(payload),
    });
  } catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};
