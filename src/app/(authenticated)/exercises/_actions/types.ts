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
