const express = require("express")
const app = express()
const http = require('http').Server(app)
const { generateMessage, generateLocationMessage } = require('./utils/messages')


const io = require('socket.io')(http,{pingTimeout:25000})
const port = 3000 || process.env.PORT 

app.use(express.static('public'))

function getConnection(socket){
    console.log("Connection done" + socket.id)
}

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('sendMessage', (message, callback) => {
        const filter = '//'
        
        if (message == filter) {
            return callback('Command prompt')
        }

        io.emit('message', generateMessage(message))
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