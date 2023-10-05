"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { POSTS_PER_PAGE } from "@/config";

interface PaginationControlsProps {
  page: string;
  allPosts: number;
  isUserPage?: boolean;
  username?: string;
}

const PaginationControls = ({
  allPosts,
  page,
  isUserPage,
  username,
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(allPosts / POSTS_PER_PAGE);

  const prevPage = Number(page) - 1;
  const nextPage = page ? Number(page) + 1 : 2;
  const pageNumber = parseInt(page);

  return (
    <div className="flex gap-2 text-sm justify-center mt-6">
      {pageNumber <= 1 ? (
        <span className="flex items-center">
          <ChevronLeft size={20} /> Anterior
        </span>
      ) : (
        <Link
          className="text-blue-500 flex items-center"
          href={
            isUserPage
              ? `/${username}/pagina/${prevPage}`
              : `/pagina/${prevPage}`
          }
        >
          <ChevronLeft size={20} /> Anterior
        </Link>
      )}
      {pageNumber >= totalPages ? (
        <span className="flex items-center">
          Proximo <ChevronRight size={20} aria-hidden="true" />
        </span>
      ) : (
        <Link
          className="text-blue-500 flex items-center"
          href={
            isUserPage
              ? `/${username}/pagina/${nextPage}`
              : `/pagina/${nextPage}`
          }
        >
          Proximo <ChevronRight size={20} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};

export default PaginationControls;
