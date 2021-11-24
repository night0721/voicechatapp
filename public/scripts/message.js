const socket = io("http://localhost:40");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const useriddiv = document.getElementById("userid-container");
// const username = prompt("What is your name?");
// socket.emit("userCreate", username);
// useriddiv.innerHTML = `Username: ${username}`;
socket.on("sendMessage", data => {
  appendMessage(`${data.user.username}(${data.user.id}): ${data.message}`);
});

socket.on("userExisted", username => {
  prompt(`User(${username}) Existed!\nPlease try a new name`);
});

socket.on("userConnected", name => {
  // Presence turn online
  appendMessage(`${name} connected`);
});

socket.on("userDisconnected", name => {
  // Presence turn offline
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document
    .getElementsByClassName("userid-container")[0]
    .innerText.slice(10);
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  const obj = {
    content: message,
    user: {
      username,
    },
  };
  socket.emit("messageCreate", obj);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.className = "alert alert-simple alert-info";
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
