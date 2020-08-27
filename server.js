const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http,{pingTimeout:25000})
const port = 3000 || process.env.PORT ;

app.use(express.static('public'))

function getConnection(socket){
    console.log("Connection done" + socket.id)

    socket.emit('msg','Welcome to chitchat')

       //Broadcast
       socket.broadcast.emit('msg','A user has joined the chat');

       socket.on('disconnect',()=>{
           io.emit('msg','A user has left the chat')
       })
socket.on('chatMsg',(msg)=>{
    io.emit('msg',msg)
    
});
function outputMsg(msg){
    const div = document.createElement('div');
    div.classList.add('msg')
    div.innerHTML = `<p class="meta">name<span>3.24pm</span></p>
    <p class="text">
    ${msg}</p>`;
    document.querySelector('.chat-messages').appendChild()
}

}


io.on("connection", getConnection)

http.listen(port,() => console.log(`Connecting to port ${port}`))