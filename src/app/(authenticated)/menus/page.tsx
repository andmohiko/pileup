import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { getMenus } from "@/app/(authenticated)/menus/_actions/menu-actions"
import { getExercises } from "@/app/(authenticated)/exercises/_actions/exercise-actions"
import { MenuList } from "@/app/(authenticated)/menus/_components/menu-list"

export default async function MenusPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/login")
  }

  const [menus, exercises] = await Promise.all([
    getMenus(user.id),
    getExercises(user.id),
  ])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <MenuList menus={menus} exercises={exercises} />
    </div>
  )
}
