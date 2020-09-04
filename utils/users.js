const users = []

const addUser = ({ id, username, room, password }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    password = password.trim().toLowerCase()

    // Validate the data
    if (!username || !room || !password) {
        return {
            error: 'Username, Room  and password are required!'
        }
    }

    if (users.length != 0) {
    // Check for correct pass
    const existingPassword = users.find((pass) => {
        console.log(pass.room === room)
        return pass.room === room && pass.password === password
    })

    // Validate password
    if (!existingPassword) {
        return {
            error: 'Password is not correct!'
        }
    }
    }

    //Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    } 

    // Store user
    const user = { id, username, room, password }
    users.push(user)
    console.log(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}