"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Dumbbell,
  PenLine,
  ClipboardList,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "ホーム", icon: Home },
  { href: "/exercises", label: "種目", icon: Dumbbell },
  { href: "/training/new", label: "記録", icon: PenLine },
  { href: "/menus", label: "メニュー", icon: ClipboardList },
  { href: "/settings", label: "設定", icon: Settings },
] as const

export function FooterNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-[env(safe-area-inset-bottom)]">
      <div className="grid h-16 grid-cols-5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
