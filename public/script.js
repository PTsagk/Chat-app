const socket = io("/");
const videoGrid = document.querySelector(".video-grid");
const chat = document.querySelector(".chat-grid");
const chatAndInput = document.querySelector(".chat-and-input");
const toggleChat = document.querySelector(".toggle-chat");
const endCall = document.querySelector(".end-call");
const messageInput = document.querySelector(".message-input");
const sendButton = document.querySelector(".send-button");
const closeCameraButton = document.querySelector(".stop-video");
const closeAudioButton = document.querySelector(".stop-audio");
const token = localStorage.getItem("token");
const myPeer = new Peer();

const url = new URL(window.location.href);
const searchParams = url.searchParams;
const username2 = searchParams.get("user");
let username2Image = "";
let currentUser = "";
let roomId = ROOM_ID;

const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;
getUserMedia({ video: true, audio: true }, (stream) => {
  myVideo.classList.add("myVideo");
  addVideoStream(myVideo, stream);
  myPeer.on("call", (call) => {
    call.answer(stream);
    const video = document.createElement("video");
    video.classList.add("theirVideo");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  });
  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  });

  closeCameraButton.addEventListener("click", () => {
    if (stream.getVideoTracks()[0].enabled == false) {
      stream.getVideoTracks()[0].enabled = true;
      closeCameraButton.innerHTML = `<i class="fa-solid fa-video"></i>`;
    } else {
      stream.getVideoTracks()[0].enabled = false;
      closeCameraButton.innerHTML = `<i class="fa-solid fa-video-slash"></i>`;
    }
  });
  closeAudioButton.addEventListener("click", () => {
    if (stream.getAudioTracks()[0].enabled == false) {
      stream.getAudioTracks()[0].enabled = true;
      closeAudioButton.innerHTML = `<i class="fa-solid fa-microphone"></i>`;
    } else {
      stream.getAudioTracks()[0].enabled = false;
      closeAudioButton.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
    }
  });
});

socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
  }
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}

async function loadChat() {
  const { data } = await axios.post(
    "/messages",
    { talkingTo: username2 },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (data.username1 != username2) {
    currentUser = data.username1;
  } else {
    currentUser = data.username2;
  }
  username2Image = await axios.post("/users/image", { username2 });
  username2Image = username2Image.data;
  const messages = data.messages;
  messages.forEach((message) => {
    let messageEl = "";
    if (message.message == "isCall") {
      messageEl = formatMessageCall(message);
    } else {
      messageEl = formatMessage(message);
    }
    chat.append(messageEl);
  });
  chat.scrollTop = chat.scrollHeight;
}

function formatMessage(message) {
  const messageEl = document.createElement("div");

  if (currentUser == message.user) {
    messageEl.innerHTML = `<p>${message.message}</p>`;
    messageEl.classList.add("my-message");
  } else {
    if (username2Image) {
      messageEl.innerHTML = `
          <img
            src="./uploads/${username2Image}"
            alt=""
          />
          <p>${message.user}: ${message.message}</p>
        `;
      messageEl.classList.add("message");
    } else {
      messageEl.innerHTML = `
          <img
            src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
            alt=""
          />
          <p>${message.user}: ${message.message}</p>
        `;
      messageEl.classList.add("message");
    }
  }
  return messageEl;
}

function formatMessageCall(message) {
  const callNotification = document.createElement("div");
  callNotification.innerHTML = `
    <img
    src="./uploads/${username2Image}"
    alt=""
  />
    <p>${message.user}: Requested a call <i class="fa-solid fa-phone-volume"></i></p>`;
  callNotification.classList.add("call-notification");
  return callNotification;
}

loadChat();

toggleChat.addEventListener("click", () => {
  chatAndInput.classList.toggle("no-display");
  toggleChat.classList.toggle("change-color");
});

endCall.addEventListener("click", () => {
  window.location.href = "/home";
});

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    messageInput.value = ``;
    const data = axios.post(
      "/messages/add",
      { message: message, talkingTo: username2 },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    socket.emit("chatMessage", roomId, message, currentUser);

    const messageEl = formatMessage({ user: currentUser, message: message });
    chat.append(messageEl);
    chat.scrollTop = chat.scrollHeight;
  }
});

socket.on("message", (message, currentUser) => {
  const messageEl = formatMessage({ user: currentUser, message: message });
  chat.append(messageEl);
  chat.scrollTop = chat.scrollHeight;
});

async function getUserImage() {
  let username2Image = await axios.post("/users/image", { username2 });
  username2Image = username2Image.data;
  console.log(username2Image);
  return username2Image;
}
