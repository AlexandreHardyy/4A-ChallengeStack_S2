import { useUserStore } from "@/store/user";

export default defineNuxtRouteMiddleware((to, from) => {
    if(!process.client) return
    
    const { getToken } = useUserStore()
    const token = getToken()

    if (to.fullPath.includes('/login') || to.fullPath.includes('/register')) {
      if (token) {
        return navigateTo('/back/dashboard')
      }
      return
    }
    if (!token) {
      return navigateTo('/login')
    }
})  