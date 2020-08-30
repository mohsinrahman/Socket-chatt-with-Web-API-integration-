const express = require("express")
const app = express()
const http = require('http').Server(app)
const Filter = require('bad-words')

const io = require('socket.io')(http,{pingTimeout:25000})
const port = 3000 || process.env.PORT 

app.use(express.static('public'))

function getConnection(socket){
    console.log("Connection done" + socket.id)
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

http.listen(port,() => console.log('Connecting to port'+ port))