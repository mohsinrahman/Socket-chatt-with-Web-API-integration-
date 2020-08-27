const chatForm = document.getElementById('chat-form')
const chatMsgs = document.querySelector('.chat-messages');

const socket  = io();

socket.on('msg',msg=>{
    console.log("I am calling msg"+msg);   
    outputMsg(msg)

    chatMsgs.scrollTop = chatMsgs.scrollHeight;
})

chatForm.addEventListener("submit",e =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMsg',msg)

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    
})

function outputMsg(msg){
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class="meta">name<span>3.24pm</span></p>
    <p class="text">
    ${msg}</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}