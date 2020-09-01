const express = require("express")
const app = express()
const http = require('http').Server(app)
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')


const io = require('socket.io')(http,{pingTimeout:25000})
const port = 3000 || process.env.PORT 

app.use(express.static('public'))

function getConnection(socket){
    console.log("Connection done" + socket.id)
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined!`))

        // socket.emit, io.emit, socket.broadcast.emit
        // io.to.emit, socket.broadcast.to.emit
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to('Center City').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

http.listen(port,() => console.log('Connecting to port'+ port))