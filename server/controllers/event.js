const user = require("../services/user");
const transactionService = require("../services/transaction");

const clients = [];

module.exports = {
    send: async (id, transctionId) => {
        for (const client of clients) {
            if (client.id === id) {
                const dataToSend = [
                    `event: dataUpdated`,
                    `data: ${JSON.stringify(await transactionService.findById(transctionId))}`,
                    "",
                ].join("\n");
                client.res.write(dataToSend + "\n");
            }
        }
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

        const timeoutId = setInterval(() => {
            res.write("data: " +""+ "\n\n");
        }, 10000);

        res.on("close", function () {
            clearInterval(timeoutId);
        });
    },
}
