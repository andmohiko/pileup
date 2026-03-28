"use client"

import type { Exercise } from "@prisma/client"
import { ExerciseCard } from "@/app/(authenticated)/exercises/_components/exercise-card"
import { CreateExerciseDialog } from "@/app/(authenticated)/exercises/_components/create-exercise-dialog"

type Props = {
  exercises: Exercise[]
}

export function ExerciseList({ exercises }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">種目一覧</h1>
        <CreateExerciseDialog />
      </div>
      {exercises.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          登録済みの種目がありません
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}
