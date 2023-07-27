import { useCustomFetch } from "./use-fetch"

const transactionService = {
    async get(params) {
        const urlParams = new URLSearchParams(params)
        const url = `transaction?${urlParams.toString()}`
        return useCustomFetch(url, {
            method: 'GET'
        })
    },
    async getById(id) {
        return useCustomFetch(`transaction/${id}`, {
            method: 'GET'
        })
    }
}

export default transactionService