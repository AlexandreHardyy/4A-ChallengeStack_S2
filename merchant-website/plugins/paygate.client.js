import { loadIframe } from './paygate/paygate-sdk'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            paygate: loadIframe
        } 
    }
})
