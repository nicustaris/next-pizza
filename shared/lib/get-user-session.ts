import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getUserSession = async () =>
  (await getServerSession(authOptions))?.user ?? null;
