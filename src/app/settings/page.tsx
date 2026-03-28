import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "./_components/logout-button"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <h1 className="text-xl font-bold">設定</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">ログイン中のアカウント</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
