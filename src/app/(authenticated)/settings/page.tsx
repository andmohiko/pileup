import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "./_components/logout-button"
import { ThemeSwitcher } from "./_components/theme-switcher"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <h1 className="text-xl font-bold">設定</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">ログイン中のアカウント</p>
          <p className="text-sm font-medium">{user?.email}</p>
        </div>
        <ThemeSwitcher />
        <LogoutButton />
      </div>
    </div>
  )
}
