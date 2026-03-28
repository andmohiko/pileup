"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">テーマ</p>
      <ToggleGroup
        type="single"
        value={theme}
        onValueChange={(value) => {
          if (value) setTheme(value)
        }}
        className="justify-start"
      >
        <ToggleGroupItem value="light" aria-label="ライトモード">
          <Sun className="size-4" />
          ライト
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="ダークモード">
          <Moon className="size-4" />
          ダーク
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="システム設定に従う">
          <Monitor className="size-4" />
          システム
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
