import { useUserStore } from "@/store/user";

export default defineNuxtRouteMiddleware( async (to, from) => {
    if (!process.client) return
    if (to.fullPath.includes('/sdk') || to.fullPath === "/") return 
    
    const { getUser, getToken } = useUserStore()
    const user = await getUser()

    if (to.fullPath.includes('/login') || to.fullPath.includes('/register')) {
      if (user?.id) {
        if (user?.isAdmin) {
          return navigateTo('/admin')
        }
        return navigateTo('/back/dashboard')   
      }
      return
    }

    if (!user?.id || !getToken()) {
      return navigateTo('/login')
    }

    if (user && !user.isAdmin && to.fullPath.includes('/admin')) {
      return navigateTo('/back/dashboard')
    }

    if (user && user.isAdmin && to.fullPath.includes('/back')) {
      return navigateTo('/admin')
    }
})  