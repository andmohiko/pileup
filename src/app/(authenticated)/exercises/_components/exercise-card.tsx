"use client"

import { useState } from "react"
import type { Exercise } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditExerciseDialog } from "@/app/(authenticated)/exercises/_components/edit-exercise-dialog"

type Props = {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: Props) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-pointer transition-colors hover:bg-accent/50"
        onClick={() => setEditOpen(true)}
      >
        <CardHeader>
          <CardTitle>{exercise.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{exercise.weight}kg</span>
            <span>{exercise.reps}回</span>
            <span>{exercise.sets}セット</span>
          </div>
        </CardContent>
      </Card>
      <EditExerciseDialog
        exercise={exercise}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  )
}
