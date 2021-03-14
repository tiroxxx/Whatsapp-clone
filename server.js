const app = require("express")()
const server = require("http").createServer(app)

const PORT = process.env.PORT || 5000;

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

server.listen(PORT, () => {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT);
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
}

io.on("connection", socket => {
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on("send-message", ({ recipients, text }) => {
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit("receive-message", { recipients: newRecipients, sender: id, text })
        })
    })
})