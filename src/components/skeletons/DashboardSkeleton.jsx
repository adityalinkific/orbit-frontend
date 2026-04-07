import { Skeleton } from "@radix-ui/themes";
import StatCardSkeleton from "./StatCardSkeleton";
import ProjectSkeleton from "./ProjectSkeleton ";
import MeetingSkeleton from "./MeetingSkeleton";
import TaskSkeleton from "./TaskSkeleton";
import HealthSkeleton from "./HealthSkeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 bg-[#f4f7fb] min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <Skeleton className="h-6 w-56 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* PROJECTS */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <Skeleton className="h-4 w-40 mb-4" />

          {[...Array(5)].map((_, i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>

        {/* MEETINGS */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <Skeleton className="h-4 w-40 mb-4" />

          {[...Array(4)].map((_, i) => (
            <MeetingSkeleton key={i} />
          ))}

          <Skeleton className="h-8 w-full mt-3 rounded-lg" />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-3 gap-6 mt-6">

        {/* TASKS */}
        <div className="col-span-2 bg-white rounded-xl p-5 shadow-sm">
          <Skeleton className="h-4 w-40 mb-4" />

          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <TaskSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* HEALTH */}
        <HealthSkeleton />
      </div>

      {/* AI INSIGHTS */}
      <div className="mt-6 rounded-xl p-6 bg-gray-200 animate-pulse">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-3/4 mb-1" />
        <Skeleton className="h-3 w-2/3 mb-3" />
        <Skeleton className="h-8 w-40 rounded-lg bg-white/50" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;