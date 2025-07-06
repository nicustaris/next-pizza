import { User } from "@prisma/client";
import { ApiRoutes } from "./constants";
import { axiosInstance } from "./instance";

export const getMe = async () => {
  const { data } = await axiosInstance.get<User>(ApiRoutes.GETME);

  return data;
};
