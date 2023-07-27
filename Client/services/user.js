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
    async create(body) {
        return useCustomFetch('user', {
            method: 'POST',
            body: JSON.stringify(body)
        })
    },
    async get(params) {
        const paramsToString = params ? Object.entries(params).reduce((s, [key, val]) => s += `${key}=${val}&`, '?') : ''
        return useCustomFetch('user' + paramsToString, {
            method: 'GET'
        })
    },
    async remove(id) {
        return useCustomFetch(`user/${id}`, {
            method: 'DELETE'
        })
    },
}

export default userService

