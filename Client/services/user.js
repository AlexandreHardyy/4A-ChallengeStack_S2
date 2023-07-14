import { useUserStore } from "~/store/user"
import { useCustomFetch } from "./use-fetch"

const userService = {
    async login(body) {
        return useCustomFetch('login', {
            method: 'POST', 
            body: JSON.stringify(body)
        })
    },
    logout() {
        useUserStore().logout()
    },
    async update(body) {
        return useCustomFetch(`user/${body.id}`, {
            method: 'PATCH', 
            body: JSON.stringify(body)
        })
    },
    async getCurrentUser() {
        return useCustomFetch('user/current', {
            method: 'GET'
        })
    },
}

export default userService