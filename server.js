const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http,{pingTimeout:25000})
const port = 3000 || process.env.PORT ;

app.use(express.static('public'))

function getConnection(socket){
    console.log("Connection done" + socket.id)
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

http.listen(port,() => console.log('Connecting to port'+ port))