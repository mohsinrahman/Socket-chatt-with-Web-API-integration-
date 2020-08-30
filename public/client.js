const socket  = io();

let rum = ""
let name = ""
let checkRum = false

window.onload = function(){
    callListner();
}

function callListner(){

     socket.on("User joined", joinUser)
     socket.on("room joined",joinRum )
     socket.on("msg",newMsg )

}
function joinUser(){
  const user =  document.querySelector('.details ')
  const rum =  document.querySelector('.chat-container ')

  user.classList.add("hide");
  rum.classList.remove("hide");
}
function joinRum(msg){
    const list  = document.querySelector('.chat-container .chat-messages')
    const chatList = document.createElement("div")
    chatList.className = "message"
    chatList.innerText = msg;
    list.appendChild(chatList)
    checkRum = true

}
function newMsg(data){
    console.log("newMsg");
    const list  = document.querySelector('.chat-container .chat-messages')
    const chatList = document.createElement("div")
    console.log("chatList"+ chatList);
    chatList.innerText = data.name + ":" + data.msg
    console.log("ddddddddddddd"+data.name + ":" + data.msg);

    list.append(chatList)
}

function userJoinBtn(){
    const [nameI,rumI] = document.querySelectorAll('.details input')
    name = nameI.value
    rum = rumI.value

    socket.emit('join room',{name,rum})
}
function sendMsg(){
 const msgI = document.querySelector(".chat-container input")
 const msg = msgI.value
 console.log("||"+msg)
 socket.emit('msg',{ name, rum, msg})
 msgI.value = ""
}