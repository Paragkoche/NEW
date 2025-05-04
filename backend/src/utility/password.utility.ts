import { compare } from 'bcrypt';

export const isValidPwdFun = async (password: string, hashPassword: string) =>
  await compare(password, hashPassword);
