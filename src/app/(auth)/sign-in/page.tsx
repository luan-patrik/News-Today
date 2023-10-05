import { redirect } from "next/navigation";
import SignIn from "@/components/SignIn";
import { getAuthSession } from "@/lib/auth";

const page = async () => {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="fixed inset-0 ">
      <div className="h-full bg-current w-full flex flex-col items-center justify-center gap-20">
        <SignIn />
      </div>
    </div>
  );
};

export default page;
