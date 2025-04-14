import { compare, genSalt, hash } from "bcrypt";

export const createPassword = async (password: string) =>
  await hash(password, await genSalt(14));

export const verifyPassword = async (password: string, bcryptPass: string) =>
  await compare(password, bcryptPass);
