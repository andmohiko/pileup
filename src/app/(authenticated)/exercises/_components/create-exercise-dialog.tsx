"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { createExercise } from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import type { ExerciseActionState } from "@/app/(authenticated)/exercises/_actions/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

const initialState: ExerciseActionState = {
  success: false,
}

export function CreateExerciseDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    createExercise,
    initialState,
  )
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.success) {
      setOpen(false)
      toast.success("種目を追加しました")
      formRef.current?.reset()
    }
  }, [state])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ＋種目を追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>種目を追加</DialogTitle>
          <DialogDescription>トレーニング種目を登録します</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-4 py-4">
            {state.errors?._form && (
              <p className="text-sm text-destructive">
                {state.errors._form[0]}
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="name">種目名</Label>
              <Input
                id="name"
                name="name"
                placeholder="例: ベンチプレス"
              />
              {state.errors?.name && (
                <p className="text-sm text-destructive">
                  {state.errors.name[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">重量 (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.01"
                min="0"
                max="999"
                placeholder="0"
              />
              {state.errors?.weight && (
                <p className="text-sm text-destructive">
                  {state.errors.weight[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reps">回数</Label>
              <Input
                id="reps"
                name="reps"
                type="number"
                min="1"
                max="100"
                placeholder="10"
              />
              {state.errors?.reps && (
                <p className="text-sm text-destructive">
                  {state.errors.reps[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sets">セット数</Label>
              <Input
                id="sets"
                name="sets"
                type="number"
                min="1"
                max="20"
                placeholder="3"
              />
              {state.errors?.sets && (
                <p className="text-sm text-destructive">
                  {state.errors.sets[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> 追加中...
                </>
              ) : (
                "追加する"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
