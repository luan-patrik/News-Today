import { Skeleton } from "../ui/skeleton";

export const PostsSkeleton = () => {
  return (
    <div className="container">
      <div className="mb-2 flex flex-row">
        <div className="mr-2">
          <Skeleton className="w-6 h-4 rounded" />
        </div>
        <div className="flex-1">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-1/2 h-4 rounded mt-2" />
        </div>
      </div>

      <div className="flex gap-2 justify-center mt-6">
        <Skeleton className="w-[80px] h-[16px] rounded" />
        <Skeleton className="w-[80px] h-[16px] rounded" />
      </div>
    </div>
  );
};

export const PostsUserSkeleton = () => {
  return (
    <div className="container">
      <Skeleton className="w-1/4 h-10" />
      <hr className="my-4 " />
      <div className="mb-2 flex flex-row">
        <div className="mr-2">
          <Skeleton className="w-6 h-4 rounded" />
        </div>
        <div className="flex-1">
          <Skeleton className="w-full h-4 rounded" />
          <Skeleton className="w-1/2 h-4 rounded mt-2" />
        </div>
      </div>

      <div className="flex gap-2 justify-center mt-6">
        <Skeleton className="w-[80px] h-[16px] rounded" />
        <Skeleton className="w-[80px] h-[16px] rounded" />
      </div>
    </div>
  );
};
