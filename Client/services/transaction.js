import { useCustomFetch } from "./use-fetch"

const transactionService = {
    async get() {
        return useCustomFetch(`transaction`, {
            method: 'GET'
        })
    },
    async getByComanyId(companyId) {
        return useCustomFetch(`transaction/company/${companyId}`, {
            method: 'GET'
        })
    },
}

export default transactionService