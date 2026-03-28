import { Skeleton } from "@/components/ui/skeleton"

export default function TrainingNewLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <Skeleton className="h-7 w-36" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  )
}
