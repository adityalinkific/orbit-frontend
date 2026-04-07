import { Skeleton } from "@radix-ui/themes";

const TaskSkeleton = () => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />

      <div>
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    <Skeleton className="h-5 w-20 rounded-full" />
  </div>
);
export default TaskSkeleton;