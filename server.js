const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", `${username} joined the conversation`);
    });

    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", `${username} left the conversation`);
    });

    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });
});

// Use a dynamic port for deployment
const PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});
