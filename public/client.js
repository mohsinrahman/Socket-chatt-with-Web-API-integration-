const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $sendGivButton = document.querySelector("#send-giv");
const $sendWeatherButton = document.querySelector("#send-weather");
const $messages = document.querySelector("#messages");
const givTemplate = document.querySelector("#giv-template").innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});


socket.on("giv", (message) => {
  console.log(message);

  const html = Mustache.render(givTemplate, {
    username: message.username,
    giv: message.giv,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  console.log(message);
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered!");
  });
});

$messageFormInput.addEventListener("keypress", logKey);
function logKey(event) {
  if ($messageFormInput.value == "/ loc") {
    $sendLocationButton.setAttribute("style", "display: block;");
  } else if ($messageFormInput.value == "/ giv") {
    $sendGivButton.setAttribute("style", "display: block;");
  } else if ($messageFormInput.value == "/ weath") {
    $sendWeatherButton.setAttribute("style", "display: block;");
  } else {
    $sendLocationButton.setAttribute("style", "display: none;");
    $sendGivButton.setAttribute("style", "display: none;");
    $sendWeatherButton.setAttribute("style", "display: none;");
  }
}

  $sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          console.log("Location shared!");
        }
      );
    });
  });

  
$sendGivButton.addEventListener("click", () => {
  $sendGivButton.setAttribute("disabled", "disabled");

  const url =
    "http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=cfwwRqigGqkeV8pidrxL6ULkN0UFJLwd&limit=5";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      socket.emit("sendGiv", data.data[0].url, (error) => {
        $sendGivButton.removeAttribute("disabled");
        if (error) {
          return console.log(error);
        }

        console.log("Giv delivered!");
        console.log(data.data[0].url+"gif");
      });
    });  
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
