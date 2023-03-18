const socket = io();
const inputField = document.querySelector("input");
const chatBox = document.querySelector(".chat-messages");
const sendButton = document.querySelector("button");
const messageContent = document.getElementsByClassName('.message-content')

let selectButtonOn = false;

sendButton.addEventListener('click', () => {
  selectButtonOn = true;
});

inputField.addEventListener("keydown", (event) => {
  if ((event.code === "Enter" || event.code === "NumpadEnter") && !event.shiftKey || selectButtonOn) {
    const messageText = inputField.value.trim();
    if (messageText !== "") {
      const message = document.createElement("div");
      message.classList.add("message");
      message.innerHTML = `
        <div class="message-content">${messageText}</div>
      `;
      message.classList.add("message-sent");
      chatBox.appendChild(message);
      inputField.value = "";
      selectButtonOn = false;

socket.emit("incoming_data", `${ 
    messageText
}`);

// socket.on('Hello', (data) => {

//   alert(data);
//   console.log(data)
// })

socket.on('msg', (data) => {
  alert(data);
})
socket.on('response_msg_1', (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <div class="message-content">${message}</div>
  `;
  messageElement.classList.add("message-received");
  chatBox.appendChild(messageElement);
});
    }
  }
});
socket.on("message", (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <div class="message-content">${message}</div>
  `;
  messageElement.classList.add("message-received");
  chatBox.appendChild(messageElement);
});

socket.on("input", (message) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.innerHTML = `
    <div class="message-content">${message}</div>
  `;
  messageElement.classList.add("message-received");
  chatBox.appendChild(messageElement);
});


socket.on("response_client_msg_2", (message) => {

  socket.on("input", (message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `
      <div class="message-content">${message}</div>
    `;
    messageElement.classList.add("message-received");
    chatBox.appendChild(messageElement);
  });
})



