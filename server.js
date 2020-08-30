const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, { pingTimeout: 25000 })
const port = 3000 || process.env.PORT;

app.use(express.static('public'))


function getConnection(socket) {
    socket.on("join room", (data) => {

        socket.join(data.rum, () => {
            io.to(socket.id).emit("User joined", "success")

            io.to(data.rum).emit("room joined", `${data.name} joined room`)


        })
        socket.on("msg", (data) => {
            io.to(data.rum).emit("msg", data)
        })
    })
}

io.on("connection", getConnection)

http.listen(port, () => console.log(`Connecting to port ${port}`))