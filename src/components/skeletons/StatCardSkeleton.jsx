import { Skeleton } from "@radix-ui/themes";

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <Skeleton className="h-3 w-24 mb-2" />
    <Skeleton className="h-6 w-16" />
  </div>
);
export default StatCardSkeleton;