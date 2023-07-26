const user = require("../services/user");

const clients = [];

module.exports = {
    send: async (id, event) => {
        clients.forEach((client) => {
            if (client.id === id) {
                const dataToSend = [
                    `event: ${event.name}`,
                    `data: ${JSON.stringify(event.data)}`,
                    "",
                ].join("\n");
                client.res.write(dataToSend + "\n");
            }
        });
    },
    subscribe: async (req, res, next) => {
        const userResponse = await user.findById(req.user.id)
        const newClient = {
            id: userResponse.Company.id,
            res
        };

        clients.push(newClient);
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        res.writeHead(200, headers);
    },
}
