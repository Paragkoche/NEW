import { Request, Response, NextFunction } from "express";
import db from "../db";
import { user } from "../db/prisma";
import { VerifyJwt } from "../utility/jwt";
import logger from "../utility/logger";

export interface AuthReq extends Request {
  user: user;
}

const authMiddleware = async (
  req: AuthReq | any,
  res: Response | any,
  next: NextFunction
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const payload = VerifyJwt(token);
    if (typeof payload == "string") {
      console.log(payload);
      return res.status(401).json({
        message: "Token is invalid",
        payload,
      });
    }
    const [id, username, _data] = payload.token.split("::");
    console.log(_data);

    const user = await db.user.findUnique({
      where: {
        id: Number(id),
        username,
      },
    });
    if (!user || user.username !== username) {
      return res.status(401).json({
        message: "User not valid",
      });
    }
    req.user = user;
    return next();
  } catch (e) {
    console.log(e);

    return res.status(403).json({ message: "Invalid token." });
  }
};

export default authMiddleware;
