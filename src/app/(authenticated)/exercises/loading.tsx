import { Skeleton } from "@/components/ui/skeleton"

export default function ExercisesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <Skeleton className="h-7 w-24" />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}
