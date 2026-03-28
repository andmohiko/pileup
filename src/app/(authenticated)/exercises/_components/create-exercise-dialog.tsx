"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { createExercise } from "@/app/(authenticated)/exercises/_actions/exercise-actions"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

export function CreateExerciseDialog() {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExerciseInput>({
    resolver: zodResolver(createExerciseSchema),
  })

  const onSubmit = async (data: CreateExerciseInput) => {
    try {
      await createExercise(data)
      setOpen(false)
      reset()
      toast.success("種目を追加しました")
    } catch {
      toast.error("種目の追加に失敗しました")
    }
  }

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">種目名</Label>
              <Input
                id="name"
                placeholder="例: ベンチプレス"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight">重量 (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                max="999"
                placeholder="0"
                {...register("weight")}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">
                  {errors.weight.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reps">回数</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="100"
                placeholder="10"
                {...register("reps")}
              />
              {errors.reps && (
                <p className="text-sm text-destructive">
                  {errors.reps.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sets">セット数</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="20"
                placeholder="3"
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
