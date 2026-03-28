export type ExerciseActionState = {
  success: boolean
  errors?: {
    name?: string[]
    weight?: string[]
    reps?: string[]
    sets?: string[]
    _form?: string[]
  }
}

export type DeleteExerciseActionState = {
  success: boolean
  errors?: {
    _form?: string[]
  }
}
