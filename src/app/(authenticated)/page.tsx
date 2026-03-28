import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <h1 className="text-xl font-bold">ホーム</h1>
      <p className="text-sm text-muted-foreground">
        ようこそ、{user?.email} さん
      </p>
      <p className="text-sm text-muted-foreground">
        トレーニング履歴がありません
      </p>
    </div>
  )
}
