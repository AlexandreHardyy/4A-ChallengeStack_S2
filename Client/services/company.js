import { useUserStore } from "~/store/user"
import { useCustomFetch } from "./use-fetch"

const companyService = {
    async create(body) {
        return useCustomFetch('company', {
            method: 'POST', 
            body: JSON.stringify(body)
        })
    },
    async update(body) {
        return useCustomFetch(`company/${body.id}`, {
            method: 'PATCH', 
            body: JSON.stringify(body)
        })
    },
}

export default companyService