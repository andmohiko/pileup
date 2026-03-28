import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">pileup</h1>
      <p className="text-muted-foreground">
        ようこそ、{user.email} さん
      </p>
    </div>
  )
}
