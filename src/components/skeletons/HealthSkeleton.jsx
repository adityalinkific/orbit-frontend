import { Skeleton } from "@radix-ui/themes";

const HealthSkeleton = () => (
  <div className="bg-white rounded-xl p-5 shadow-sm">
    <Skeleton className="h-4 w-32 mb-4" />
    <Skeleton className="h-3 w-24 mb-2" />
    <Skeleton className="h-3 w-20" />
  </div>
);
export default HealthSkeleton;