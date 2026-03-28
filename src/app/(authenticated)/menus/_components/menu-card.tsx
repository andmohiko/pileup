"use client"

import type { getMenus } from "@/app/(authenticated)/menus/_actions/menu-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Menu = Awaited<ReturnType<typeof getMenus>>[number]

type Props = {
  menu: Menu
}

export function MenuCard({ menu }: Props) {
  return (
    <Card className="cursor-pointer transition-colors hover:bg-accent/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{menu.title}</CardTitle>
          <Badge variant="secondary">{menu.menuItems.length}種目</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          {menu.menuItems.map((item) => (
            <span key={item.id} className="text-sm text-muted-foreground">
              {item.exercise.name}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
