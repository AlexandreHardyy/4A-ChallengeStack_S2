import { useUserStore } from "~/store/user"
import { useCustomFetch } from "./use-fetch"

const userService = {
    async register(body) {
        return useCustomFetch('user', {
            method: 'POST', 
            body: JSON.stringify(body)
        })
    },
    async login(body) {
        return useCustomFetch('login', {
            method: 'POST', 
            body: JSON.stringify(body)
        })
    },
    logout() {
        useUserStore().logout()
    }
}

export default userService