import React from "react";
import EditorPost from "@/components/editor/EditorPost";
import { getAuthSession } from "@/lib/auth";

export default async function Publish() {
  const session = await getAuthSession();

  if (!session?.user) {
    return <h1>Não autorizado</h1>;
  }
  return (
    <div className="flex flex-col items-start gap-6 container">
      <div className="pb-5">
        <div className="flex flex-wrap items-baseline">
          <h1 className="mt-2 text-2xl font font-semibold leading-6 text-neutral-950 dark:text-neutral-50">
            Publicar novo conteúdo
          </h1>
        </div>
      </div>
      {/* form */}
      <EditorPost />
    </div>
  );
}
