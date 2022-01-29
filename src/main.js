const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const DB = require('./Config/index');
const Route = require('./Route/index');
const cokieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.HTTP_CORS,
        methods: ["GET", "POST"]
    }
});

// const server = require('http').Server(app);
// const io = require('socket.io')(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });
const PORT = process.env.PORT || 3001;
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cokieParser());

// connected to mongodb
DB.connect();
app.use(cors());
// use router
Route(app);

let Users = [];
const addUser = (userId, socketId) => {

    !Users.some((use) => use.userId === userId) && Users.push({ userId, socketId });
};
const remoneUser = (socketId => {
    Users = Users.filter((use) => {
        return use.socketId !== socketId;
    })
})
io.on("connection", (socket) => {
    // khi kết nối tới socket
    // console.log("kết nối thành công", socket.id);
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUser", Users);
        console.log("user", Users)
    });

    socket.on("sendMessage", ({ senderId, userId, text }) => {
        const skId = Users.find((user) => user.userId === userId);
        try {
            const a = skId.socketId;
            io.to(a).emit("getMessage", { senderId, text });
        } catch (error) {
            console.log("lỗi")
        }

    })
    // ngắt kết nối
    socket.on("disconnect", () => {
        remoneUser(socket.id);
        io.emit("getUser", Users);
        console.log("ngắt kết nối", Users)
    });
});

httpServer.listen(PORT, () => {
    console.log('sever is running success !');
})