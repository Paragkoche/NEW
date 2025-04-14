import { format } from "date-fns";
export const createToken = (id: number, username: string) => {
  return `${id}::${username}::${format(new Date(), "HH:mm:ss:SSS")}`;
};
