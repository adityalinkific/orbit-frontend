import React from "react";

const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 ${className}`} />
);

const MeetingsSidebarSkeleton = () => {
  return (
    <div className="w-[340px] flex flex-col h-screen overflow-y-auto">

      {/* Header */}
      <div className="p-6">
        <SkeletonBlock className="h-6 w-32 rounded mb-2" />
        <SkeletonBlock className="h-4 w-52 rounded" />
      </div>

      {/* Tabs */}
      <div className="px-6 py-4">
        <div className="flex gap-2 bg-[#f1f5f9] p-1 rounded-sm shadow-md w-fit">
          <SkeletonBlock className="h-8 w-20 rounded-sm" />
          <SkeletonBlock className="h-8 w-20 rounded-sm" />
        </div>
      </div>

      {/* Today label */}
      <div className="px-6 mt-10">
        <SkeletonBlock className="h-3 w-28 rounded" />
      </div>

      {/* Meeting list */}
      <div className="p-6 pt-3 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="border border-[#e0e0e0] rounded-lg p-4 bg-white"
          >
            {/* Title + status */}
            <div className="flex justify-between items-center">
              <SkeletonBlock className="h-4 w-32 rounded" />
              <SkeletonBlock className="h-4 w-16 rounded" />
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 mt-3">
              <SkeletonBlock className="w-4 h-4 rounded" />
              <SkeletonBlock className="h-3 w-16 rounded" />
            </div>

            {/* Avatars + button */}
            <div className="flex justify-between items-center mt-4">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, j) => (
                  <SkeletonBlock
                    key={j}
                    className="w-7 h-7 rounded-full border"
                  />
                ))}
              </div>

              <SkeletonBlock className="h-7 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsSidebarSkeleton;
