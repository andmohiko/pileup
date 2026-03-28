"use client"

import type { Exercise } from "@prisma/client"
import type { getMenus } from "@/app/(authenticated)/menus/_actions/menu-actions"
import { MenuCard } from "@/app/(authenticated)/menus/_components/menu-card"
import { CreateMenuSheet } from "@/app/(authenticated)/menus/_components/create-menu-sheet"

type Props = {
  menus: Awaited<ReturnType<typeof getMenus>>
  exercises: Exercise[]
}

export function MenuList({ menus, exercises }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">メニュー一覧</h1>
        <CreateMenuSheet exercises={exercises} />
      </div>
      {menus.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          登録済みのメニューがありません
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </div>
  )
}
