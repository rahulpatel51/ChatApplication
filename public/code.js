(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector("#join-user").addEventListener("click", function () {
        let username = app.querySelector("#username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector("#send-message").addEventListener("click", function () {
        let message = app.querySelector("#message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", { username: uname, text: message });
        socket.emit("chat", { username: uname, text: message });
        app.querySelector("#message-input").value = "";
    });

    app.querySelector("#exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        app.querySelector(".chat-screen").classList.remove("active");
        app.querySelector(".join-screen").classList.add("active");
    });

    socket.on("update", function (message) {
        renderMessage("update", message);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".messages");

        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
})();
