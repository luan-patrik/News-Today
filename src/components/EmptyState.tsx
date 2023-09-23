import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  redirectInitial?: boolean;
}

const EmptyState = ({ title, subtitle, redirectInitial }: EmptyStateProps) => {
  return (
    <div className="container flex flex-col justify-center items-center text-foreground">
      <div>
        <div className="text-2xl font-bold text-center">{title}</div>
        <div className="font-medium text-xl mt-2">{subtitle}</div>
      </div>
      <div className="mt-4">
        {redirectInitial && (
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-sm text-foreground border-2 rounded-full uppercase"
            )}
          >
            IR PARA A PÁGINA INICIAL
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
