export const loadIframe = (clientToken, transactionToken) => {

    const config = useRuntimeConfig();

    const iframe = document.createElement('iframe');
    iframe.src = `${config.public.apiBaseClient}/transaction/${transactionToken}/sdk?clientToken=${clientToken}`
    iframe.style.position = 'absolute'
    iframe.style.top = '50px'
    iframe.style.left = '50%'
    iframe.style.transform = 'translate(-50%)'
    iframe.style.width = '50%'
    iframe.style.height = '700px'
    document.body.appendChild(iframe)

    window.addEventListener('message', (event) => {
        if (event.origin === config.public.apiBaseClient) {
            window.location.replace(event.data)
        }
    })
}