import { useCustomFetch } from "./use-fetch"

const transactionService = {
    async get(params) {
        const { from, to } = params
        const url = from && to ? `transaction?from=${from}&to=${to}` : 'transaction'
        return useCustomFetch(url, {
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