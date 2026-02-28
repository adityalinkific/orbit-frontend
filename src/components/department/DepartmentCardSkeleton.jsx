import { Skeleton } from "@radix-ui/themes"

const DepartmentCardSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton width="40px" height="40px" />
        <Skeleton width="20px" height="20px" />
      </div>

      <Skeleton height="18px" width="70%" />
      <Skeleton height="14px" width="100%" />
      <Skeleton height="14px" width="85%" />

      <Skeleton height="1px" width="100%" />

      <Skeleton height="14px" width="40%" />
      <Skeleton height="14px" width="60%" />
    </div>
  )
}

export default DepartmentCardSkeleton
