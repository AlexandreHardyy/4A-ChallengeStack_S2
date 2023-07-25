import { useCustomFetch } from "./use-fetch"

const transactionService = {
    async get(params) {
        const url = params && params.from && params.to ? `transaction?from=${params.from}&to=${params.to}` : 'transaction'
        return useCustomFetch(url, {
            method: 'GET'
        })
    },
    async getById(id) {
        return useCustomFetch(`transaction/${id}`, {
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