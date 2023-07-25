import { useUserStore } from "@/store/user";

export default defineNuxtRouteMiddleware((to, from) => {
    if (!process.client) return
    if (to.fullPath.includes('/sdk')) return 
    
    const { getUser } = useUserStore()
    const user = getUser()

    if (to.fullPath.includes('/login') || to.fullPath.includes('/register')) {
      if (user?.token) {
        if (user?.isAdmin) {
          return navigateTo('/admin')
        }
        return navigateTo('/back/dashboard')   
      }
      return
    }

    if (!user?.token) {
      return navigateTo('/login')
    }

    if (user && !user.isAdmin && to.fullPath.includes('/admin')) {
      return navigateTo('/back/dashboard')
    }
})  