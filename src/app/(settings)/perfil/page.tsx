import UserPerfilForm from "@/components/UserPerfilForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Perfil",
  description: "Configurações do perfil.",
};

const Perfil = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  return (
    <div className="container max-w-3xl py-4">
      <div className="grid items-start gap-8">
        <h1 className="font-semibold text-2xl md:text-3xl mb-4">
          Editar Perfil
        </h1>
      </div>
      <div className="grid gap-10">
        <UserPerfilForm
          user={{
            id: session.user.id,
            username: session.user.username || "",
            email: session.user.email || "",
          }}
        />
      </div>
    </div>
  );
};

export default Perfil;
