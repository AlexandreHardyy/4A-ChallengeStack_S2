const subscribers = {};

module.exports = {
    send: async (event, res) => {
        Object.entries(subscribers).forEach(([id, res]) => {
            console.log("send to", subscribers);
            res.write(`event: ${event}\n`);
        });
    },
    subscribe: async (req, res, next) => {
        subscribers[req.user.id] = res;
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        setInterval(async () => {
            await module.exports.send("test");
        }, 5000);
    },
}
