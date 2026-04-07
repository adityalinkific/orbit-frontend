import { Skeleton } from "@radix-ui/themes";

const MeetingSkeleton = () => (
  <div className="flex justify-between items-center mb-4 p-3">
    <div>
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>

    <div className="flex flex-col items-end gap-2">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-3 w-16 rounded-full" />
    </div>
  </div>
);
export default MeetingSkeleton;