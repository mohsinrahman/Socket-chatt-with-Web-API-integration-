const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateGif = (username, gif) => {
    return {
        username,
        gif,
        createdAt: new Date().getTime()
    }
}

const generateNpa = (username, npa) => {
    return {
        username,
        npa,
        createdAt: new Date().getTime()
    }
}

const generateCorona = (username, corona) => {
    return {
        username,
        corona,
        createdAt: new Date().getTime()
    }
}

const generateWeather = (username, weather) => {
    return {
        username,
        weather,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateGif,
    generateNpa,
    generateWeather,
    generateCorona
}