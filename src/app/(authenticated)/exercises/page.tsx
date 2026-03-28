import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { getExercises } from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import { ExerciseList } from "@/app/(authenticated)/exercises/_components/exercise-list"

export default async function ExercisesPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/login")
  }

  const exercises = await getExercises(user.id)

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <ExerciseList exercises={exercises} />
    </div>
  )
}
