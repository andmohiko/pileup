import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { FooterNav } from "@/components/footer-nav"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <main className="flex-1 pb-16">{children}</main>
      <FooterNav />
    </>
  )
}
