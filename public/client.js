const socket = io();
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $sendNpaButton = document.querySelector("#send-npa");
const $sendGifButton = document.querySelector("#send-gif");
const $sendCoronaButton = document.querySelector("#send-corona");
const $sendWeatherButton = document.querySelector("#send-weather");
const $messages = document.querySelector("#messages");
const weatherTemplate = document.querySelector("#weather-template").innerHTML;
const coronaTemplate = document.querySelector("#corona-template").innerHTML;
const npaTemplate = document.querySelector("#npa-template").innerHTML;
const gifTemplate = document.querySelector("#gif-template").innerHTML;
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room, password } = Qs.parse(location.search, {ignoreQueryPrefix: true});

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
  //console.log(message);

  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});


socket.on("weather", (message) => {
  console.log(message);

  const html = Mustache.render(weatherTemplate, {
    username: message.username,
    weather: message.weather,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("corona", (message) => {
  console.log(message);

  const html = Mustache.render(coronaTemplate, {
    username: message.username,
    corona: message.corona,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});



socket.on("npa", (message) => {
  console.log(message);

  const html = Mustache.render(npaTemplate, {
    username: message.username,
    npa: message.npa,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});


socket.on("gif", (message) => {
  console.log(message);

  const html = Mustache.render(gifTemplate, {
    username: message.username,
    gif: message.gif,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (message) => {
  //console.log(message);
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
      return //console.log(error);
    }

    //console.log("Message delivered!");
  });
});

$messageFormInput.addEventListener("keypress", logKey);
function logKey(event) {
  if ($messageFormInput.value == "/") {
    $sendLocationButton.setAttribute("style", "display: block;");
    $sendGifButton.setAttribute("style", "display: block;");
    $sendWeatherButton.setAttribute("style", "display: block;");
    $sendNpaButton.setAttribute("style", "display: block;");
    $sendCoronaButton.setAttribute("style", "display: block;");
  
  } else {
    $sendLocationButton.setAttribute("style", "display: none;");
    $sendGifButton.setAttribute("style", "display: none;");
    $sendWeatherButton.setAttribute("style", "display: none;");
    $sendNpaButton.setAttribute("style", "display: none;");
    $sendCoronaButton.setAttribute("style", "display: none;");
  }
}

  $sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
    }

    $sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit("sendLocation", { latitude: position.coords.latitude, longitude: position.coords.longitude },
        () => {
          $sendLocationButton.removeAttribute("disabled");
          //console.log("Location shared!");
        }
      );
    });
  });

  
$sendNpaButton.addEventListener("click", () => {

  fetch("https://free-nba.p.rapidapi.com/teams?page=0", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "free-nba.p.rapidapi.com",
		"x-rapidapi-key": "afb48088ecmsh59b8e61d2278399p123ef7jsned35f364abc9"
	}
})
.then((response) => response.json())
    .then((data) => {
      const npaResult = 'Best NPA Club in USA is  abbreviation:'+ data.data[0].abbreviation + ' ,city:' + data.data[0].city + ' ,conference:'+ data.data[0].conference + ' ,full_name:'+ data.data[0].full_name + ' ,name:'+ data.data[0].name
      socket.emit("sendNPA", npaResult, (error) => {       
        if (error) {
          return console.log(error);
        }    
        console.log("Npa delivered!");        
      console.log('abbreviation:'+ data.data[0].abbreviation + ' ,city:' + data.data[0].city + ' ,conference:'+ data.data[0].conference + ' ,full_name:'+ data.data[0].full_name + ' ,name:'+ data.data[0].name);
      });
    });       
});


$sendCoronaButton.addEventListener("click", () => {

  fetch("https://covid-193.p.rapidapi.com/statistics?country=Sweden", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "covid-193.p.rapidapi.com",
		"x-rapidapi-key": "afb48088ecmsh59b8e61d2278399p123ef7jsned35f364abc9"
	}
})
.then((response) => response.json())
    .then((data) => {
      
      const coronaResult = 'Corona Virus Result in Sweden:    Day:'+ data.response[0].day + '   ,cases:' + data.response[0].cases.total + '   ,deaths:'+ data.response[0].deaths.total + '   ,tests:'+ data.response[0].tests.total  
      socket.emit("sendCorona", coronaResult, (error) => {       
        if (error) {
          return console.log(error);
        }  
        console.log("Corona delivered!");  
        
      console.log('Day:'+ data.response[0].day + ' ,cases:' + data.response[0].cases.total + ' ,deaths:'+ data.response[0].deaths.total + ' ,tests:'+ data.response[0].tests.total);
      });
    });       
});


$sendGifButton.addEventListener("click", () => {
  const url =
    "http://api.giphy.com/v1/gifs/search?q=cheeseburgers&api_key=cfwwRqigGqkeV8pidrxL6ULkN0UFJLwd&limit=5";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      socket.emit("sendGif", data.data[0].url, (error) => {
        if (error) {
          return console.log(error);
        }
        const resultGif = data.data[0].url
        console.log("Gif delivered!");
        console.log(data.data[0].url);
      });
    });   
});

$sendWeatherButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
      
  const url = 'http://api.weatherstack.com/current?access_key=e1acc672f48faa04f0ab6fd194c7e625&query=' +  position.coords.latitude + ',' +  position.coords.longitude

  fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const weatherResult ='Today the weather in Sweden is: ' + data.current.weather_descriptions[0]+ " It is currently " + data.current.temperature +  " ℃. There is a " + data.current.precip + "% chance of rain.";
        socket.emit("sendWeather", weatherResult, (error) => {
          if (error) {
            return console.log(error);
          }
         
          console.log("Weather delivered!");
          console.log(data.current.weather_descriptions[0]+
            " It is currently " +
            data.current.temperature +
            " ℃. There is a " +
            data.current.precip +
            "% chance of rain.");
        });
      });   
 });
});

socket.emit("join", { username, room, password }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
