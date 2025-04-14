import jwt, { JwtPayload } from "jsonwebtoken";
import env from "./env";
const KEY = env.JWT_KEY!;
interface jwtPayload {
  token: string;
}

export const createJwt = (payload: jwtPayload) => jwt.sign(payload, KEY);
export const VerifyJwt = (token: string): JwtPayload | string =>
  jwt.verify(token, KEY);
