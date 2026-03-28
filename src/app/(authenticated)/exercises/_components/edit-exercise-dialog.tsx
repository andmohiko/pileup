"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { Exercise } from "@prisma/client"
import {
  updateExercise,
  deleteExercise,
} from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import {
  createExerciseSchema,
  type CreateExerciseInput,
} from "@/app/(authenticated)/exercises/_actions/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  exercise: Exercise
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExerciseDialog({ exercise, open, onOpenChange }: Props) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseInput>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: exercise.name,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
    },
  })

  const onSubmit = async (data: CreateExerciseInput) => {
    try {
      await updateExercise({ id: exercise.id, ...data })
      onOpenChange(false)
      toast.success("種目を更新しました")
    } catch {
      toast.error("種目の更新に失敗しました")
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteExercise(exercise.id)
      setDeleteConfirmOpen(false)
      onOpenChange(false)
      toast.success("種目を削除しました")
    } catch (error) {
      setDeleteConfirmOpen(false)
      toast.error(
        error instanceof Error
          ? error.message
          : "種目の削除に失敗しました",
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>種目を編集</DialogTitle>
            <DialogDescription>
              種目の情報を編集します
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">種目名</Label>
                <Input
                  id="edit-name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-weight">重量 (kg)</Label>
                <Input
                  id="edit-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="999"
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-sm text-destructive">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reps">回数</Label>
                <Input
                  id="edit-reps"
                  type="number"
                  min="1"
                  max="100"
                  {...register("reps")}
                />
                {errors.reps && (
                  <p className="text-sm text-destructive">
                    {errors.reps.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sets">セット数</Label>
                <Input
                  id="edit-sets"
                  type="number"
                  min="1"
                  max="20"
                  {...register("sets")}
                />
                {errors.sets && (
                  <p className="text-sm text-destructive">
                    {errors.sets.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> 更新中...
                  </>
                ) : (
                  "更新する"
                )}
              </Button>
            </DialogFooter>
          </form>
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              この種目を削除する
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>種目を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              「{exercise.name}」を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Spinner /> 削除中...
                </>
              ) : (
                "削除する"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
