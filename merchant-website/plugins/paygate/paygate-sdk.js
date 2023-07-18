export const loadIframe = (clientToken, transactionToken) => {

    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:3003/sdk?clientToken=${clientToken}&transactionToken=${transactionToken}`
    iframe.style.position = 'absolute'
    iframe.style.top = '50px'
    iframe.style.left = '50%'
    iframe.style.transform = 'translate(-50%)'
    iframe.style.width = '50%'
    iframe.style.height = '700px'
    document.body.appendChild(iframe)

    window.addEventListener('message', (event) => {
        if (event.origin === 'http://localhost:3003') {
            window.location.replace(event.data)
        }
    })
}