import { prisma } from "@/prisma/prisma-client";
import { ProfileForm } from "@/shared/components/shared";
import { getUserSession } from "@/shared/lib/get-user-session";
import { notFound, redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getUserSession();

  if (!session) {
    return redirect("/not-authenticated");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: Number(session?.id),
    },
  });

  if (!user) {
    return redirect("/not-authenticated");
  }
  return <ProfileForm data={user} />;
}
