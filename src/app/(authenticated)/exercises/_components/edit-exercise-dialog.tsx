"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { Exercise } from "@prisma/client"
import {
  updateExercise,
  deleteExercise,
} from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import type {
  ExerciseActionState,
  DeleteExerciseActionState,
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

const initialUpdateState: ExerciseActionState = {
  success: false,
}

const initialDeleteState: DeleteExerciseActionState = {
  success: false,
}

export function EditExerciseDialog({ exercise, open, onOpenChange }: Props) {
  const [updateState, updateAction, isUpdatePending] = useActionState(
    updateExercise,
    initialUpdateState,
  )
  const [deleteState, deleteAction, isDeletePending] = useActionState(
    deleteExercise,
    initialDeleteState,
  )
  const formRef = useRef<HTMLFormElement>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (updateState.success) {
      onOpenChange(false)
      toast.success("種目を更新しました")
    }
  }, [updateState, onOpenChange])

  useEffect(() => {
    if (deleteState.success) {
      setDeleteConfirmOpen(false)
      onOpenChange(false)
      toast.success("種目を削除しました")
    } else if (deleteState.errors?._form) {
      setDeleteConfirmOpen(false)
      toast.error(deleteState.errors._form[0])
    }
  }, [deleteState, onOpenChange])

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
          <form
            ref={formRef}
            action={updateAction}
            key={exercise.updatedAt.toString()}
          >
            <input type="hidden" name="id" value={exercise.id} />
            <div className="grid gap-4 py-4">
              {updateState.errors?._form && (
                <p className="text-sm text-destructive">
                  {updateState.errors._form[0]}
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-name">種目名</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={exercise.name}
                />
                {updateState.errors?.name && (
                  <p className="text-sm text-destructive">
                    {updateState.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-weight">重量 (kg)</Label>
                <Input
                  id="edit-weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="999"
                  defaultValue={exercise.weight}
                />
                {updateState.errors?.weight && (
                  <p className="text-sm text-destructive">
                    {updateState.errors.weight[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reps">回数</Label>
                <Input
                  id="edit-reps"
                  name="reps"
                  type="number"
                  min="1"
                  max="100"
                  defaultValue={exercise.reps}
                />
                {updateState.errors?.reps && (
                  <p className="text-sm text-destructive">
                    {updateState.errors.reps[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-sets">セット数</Label>
                <Input
                  id="edit-sets"
                  name="sets"
                  type="number"
                  min="1"
                  max="20"
                  defaultValue={exercise.sets}
                />
                {updateState.errors?.sets && (
                  <p className="text-sm text-destructive">
                    {updateState.errors.sets[0]}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isUpdatePending}>
                {isUpdatePending ? (
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
            <form action={deleteAction}>
              <input type="hidden" name="id" value={exercise.id} />
              <AlertDialogAction
                type="submit"
                disabled={isDeletePending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletePending ? (
                  <>
                    <Spinner /> 削除中...
                  </>
                ) : (
                  "削除する"
                )}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
