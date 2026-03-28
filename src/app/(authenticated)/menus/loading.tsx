import { Skeleton } from "@/components/ui/skeleton"

export default function MenusLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <Skeleton className="h-7 w-28" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}
