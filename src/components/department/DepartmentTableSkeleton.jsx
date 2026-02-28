import { Skeleton } from "@radix-ui/themes"

const DepartmentTableSkeleton = () => {
  return (
    <div className="rounded-xl border bg-white p-4 space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-6 items-center">
          <Skeleton height="14px" width="160px" />
          <Skeleton height="14px" width="260px" />
          <Skeleton height="14px" width="140px" />
          <Skeleton height="14px" width="60px" />
          <Skeleton height="14px" width="100px" />
        </div>
      ))}
    </div>
  )
}

export default DepartmentTableSkeleton
