require("dotenv").config();
const express = require('express');
const app = express();
const authRouter = require("./api/auth/auth.router")
const userRouter = require("./api/users/user.router")
const masterMenuRouter = require("./api/masterMenu/masterMenu.router")
const masterRoleRouter = require("./api/masterRole/masterRole.router")
const dashboardRouter = require("./api/dashboard/dashboard.router")
const masterFungsiRouter = require("./api/fungsi/masterFungsi.router")
const model = require('./models/index');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})
app.use(cors());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/menus", masterMenuRouter);
app.use("/api/fungsi", masterFungsiRouter);
app.use("/api/roles", masterRoleRouter);
app.use("/api/dashboard", dashboardRouter);

// app.use(history({
//     verbose: true
// }));
// const path = __dirname + '/public/';
// app.use(express.static(path));

// app.get('/', function (req, res) {
//     res.sendFile(path + "index.html");
// });

const server = app.listen(process.env.APP_PORT, () => {
    console.log("Server sedang berjalan", process.env.APP_PORT);
});

// const io = require('socket.io')(server, {
//     cors: {
//         origins: [""],
//         handlePreflightRequest: (req, res) => {
//             res.writeHead(200, {
//                 "Access-Controll-Allow-Origin": "*",
//                 "Access-Controll-Allow-Methods": "GET,POST",
//                 "Access-Controll-Allow-Headers": "my-custom-header",
//                 "Access-Controll-Allow-Creadentials": true
//             })
//             res.end();
//         }
//     }
// });

// function getRandomValue() {
//     return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
// }
// io.on("connection", socket => {
//     setInterval(() => {
//         socket.broadcast.emit("newdata", getRandomValue())

//     }, 6000)
// });

