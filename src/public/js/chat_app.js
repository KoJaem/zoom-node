// chat 관련 내용을 실행하고 싶으면 chat_* -> * 로 이름 변경하고 실행

const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function showRoom(count) {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;

  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#nickname");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#nickname input");
  socket.emit("nickname", input.value);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomNameInput = form.querySelector("#roomName");
  const nicknameInput = form.querySelector("#nickname");
  socket.emit("enter_room", roomNameInput.value, nicknameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySelector("#nickname input");
  changeNameInput.value = nicknameInput.value;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${nickname} joined!`);
});

socket.on("bye", (nickname, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${nickname} left ㅠㅠ`);
});

socket.on("new_message", msg => {
  addMessage(`${msg}`);
});

// socket.on("room_change", (msg) => console.log(msg));
socket.on("room_change", rooms => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  // if (rooms.length === 0) {
  //   return;
  // }
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerHTML = room;
    roomList.append(li);
  });
});
