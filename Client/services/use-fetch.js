import { createFetch } from '@vueuse/core'
import { useUserStore } from "~/store/user"

export const useCustomFetch = createFetch({
    baseUrl: 'http://localhost:3000',
    options: {
      async beforeFetch({ options }) {
        const { getUser } = useUserStore()
        const user = getUser()
    
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (user?.token) {
            options.headers.Authorization = `Bearer ${user.token}`
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