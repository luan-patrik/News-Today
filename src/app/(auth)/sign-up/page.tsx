import { redirect } from "next/navigation";
import SignUp from "@/components/SignUp";
import { getAuthSession } from "@/lib/auth";

const page = async () => {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="fixed inset-0 ">
      <div className="h-full bg-current w-full flex flex-col items-center justify-center gap-20">
        <SignUp />
      </div>
    </div>
  );
};

export default page;
