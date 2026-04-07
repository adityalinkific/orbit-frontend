import { Skeleton } from "@radix-ui/themes";

const ProjectSkeleton = () => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-10" />
    </div>
    <Skeleton className="h-2 w-full" />
  </div>
);
export default ProjectSkeleton;