import { createFetch } from '@vueuse/core'
import { useUserStore } from "~/store/user"

export const useCustomFetch = createFetch({
    baseUrl: 'http://localhost:3000',
    options: {
      async beforeFetch({ options }) {
        const { getToken } = useUserStore()
        const token = getToken()
    
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (token) {
            options.headers.Authorization = `Bearer ${token}`
        }
  
        return { options }
      },
      async afterFetch(response) {
        if (response.data) {
            response.data = JSON.parse(response.data)
        }

        return response
      },
    },
})