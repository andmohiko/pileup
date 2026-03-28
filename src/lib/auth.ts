import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function getAuthUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return null

  return prisma.user.findUnique({ where: { email: user.email } })
}
