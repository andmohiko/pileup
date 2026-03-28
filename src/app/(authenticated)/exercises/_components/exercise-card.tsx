import type { Exercise } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  exercise: Exercise
}

export function ExerciseCard({ exercise }: Props) {
  return (
    <Card>
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
  )
}
