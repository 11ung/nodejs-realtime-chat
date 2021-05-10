const express = require('express')
const userRouter = require('./routers/user')
const messageRouter = require('./routers/message')
const authSocket = require('./middleware/authSocket')
const { createNewMessage } = require('./controllers/message.controller')
const port = process.env.PORT
require('./db/db')
const app = express()

var server = require('http').Server(app);
var io = require('socket.io')(server, {
    path: '/socket',
});

app.use(express.json())
app.use(userRouter)
app.use(messageRouter)

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


io.use(authSocket).on("connection", (socket) => {
    console.log(socket.id + ': connected');

    socket.on('disconnect', function () {
        console.log(socket.id + ': disconnected')
    })

    io.sockets.on('newMessage',function () {
    })

    socket.on('sendMessage', async data => {
        const payload = {...data};
        payload.creator = socket.user._id;
        const message = await createNewMessage(payload);
        io.sockets.emit('sendMessage', { data: message, id: socket.user });
        io.sockets.emit('newMessage',  { data: message, id: socket.user });
    })

});

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
})