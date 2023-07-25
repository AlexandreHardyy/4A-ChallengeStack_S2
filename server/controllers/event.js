const clients = [];

module.exports = {
    send: async (data) => {
        clients.forEach((client) => {
            if (client.id === data.id) {
                client.res.write(`data: ${JSON.stringify(data)}` + "\n\n");
            }
        });
    },
    subscribe: async (req, res, next) => {
        const newClient = {
            id: req.user.id,
            res
        };

        clients.push(newClient);
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);

        /*setInterval(async () => {
            await module.exports.send({
              id: 1,
              test: true
            });
        }, 5000);*/
    },
}
