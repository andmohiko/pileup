"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { Exercise } from "@prisma/client"
import { createMenu } from "@/app/(authenticated)/menus/_actions/menu-actions"
import {
  createMenuSchema,
  type CreateMenuInput,
} from "@/app/(authenticated)/menus/_actions/types"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"

type Props = {
  exercises: Exercise[]
}

export function CreateMenuSheet({ exercises }: Props) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMenuInput>({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      title: "",
      exerciseIds: [],
    },
  })

  const selectedIds = watch("exerciseIds")

  const handleCheckboxChange = (exerciseId: string, checked: boolean) => {
    const current = selectedIds ?? []
    const next = checked
      ? [...current, exerciseId]
      : current.filter((id) => id !== exerciseId)
    setValue("exerciseIds", next, { shouldValidate: true })
  }

  const onSubmit = async (data: CreateMenuInput) => {
    try {
      await createMenu(data)
      setOpen(false)
      reset()
      toast.success("メニューを作成しました")
    } catch {
      toast.error("メニューの作成に失敗しました")
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          ＋メニューを追加
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-full">
        <SheetHeader>
          <SheetTitle>メニューを作成</SheetTitle>
          <SheetDescription>
            トレーニングメニューのテンプレートを作成します
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">メニュータイトル</Label>
            <Input
              id="title"
              placeholder="例: 胸肩メニュー"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>
              種目を選択{" "}
              <span className="text-muted-foreground">
                ({selectedIds?.length ?? 0}件選択中)
              </span>
            </Label>
            {errors.exerciseIds && (
              <p className="text-sm text-destructive">
                {errors.exerciseIds.message}
              </p>
            )}
            {exercises.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                種目が登録されていません。先に種目を登録してください。
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {exercises.map((exercise) => (
                  <label
                    key={exercise.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50"
                  >
                    <Checkbox
                      checked={selectedIds?.includes(exercise.id) ?? false}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(exercise.id, checked === true)
                      }
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {exercise.weight}kg / {exercise.reps}回 /{" "}
                        {exercise.sets}セット
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
          <SheetFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> 作成中...
                </>
              ) : (
                "作成する"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
