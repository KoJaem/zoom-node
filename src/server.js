import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const sockets = []; // fake DB

// socket: 브라우저와 서버의 연결 정보
wss.on("connection", socket => {
  sockets.push(socket);

  socket["nickname"] = "Anonymous";

  console.log("Connected to Browser ✅");

  socket.on("close", () => {
    console.log("Disconnected to Browser ❌");
  });

  socket.on("message", msg => {
    const message = JSON.parse(msg);

    switch (message.type) {
      case "new_message":
        sockets.filter((aSocket) => aSocket !== socket).forEach((filteredSocket) => filteredSocket.send(`test`))
      break;
      case "nickname":
        socket["nickname"] = message.payload;
      break;
    }
  });
});

server.listen(3000, handleListen);

// {
//   type: "message",
//   payload: "hello everyone!"
// }

// {
//   type: "nickname",
//   payload: "kojaem"
// }
