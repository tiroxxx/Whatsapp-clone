const express = require("express")
const app = express()
const server = require("http").createServer(app)
const path = require("path")

const PORT = process.env.PORT || 8080;

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

app.use(express.static("client/build"))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
    })
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