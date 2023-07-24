import { useCustomFetch } from "./use-fetch"

const transactionService = {
    async get() {
        return useCustomFetch(`transaction`, {
            method: 'GET'
        })
    },
    async getByCompanyId(companyId) {
        return useCustomFetch(`transaction/company/${companyId}`, {
            method: 'GET'
        })
    },
}

export default transactionService