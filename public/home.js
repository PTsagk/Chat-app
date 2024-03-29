//Initializing variables
const socket = io();
const messageForm = document.querySelector(".input-container");
const messageInput = document.querySelector(".message-input");
const messageContainer = document.querySelector(".message-container");
const friends = document.querySelector(".friends");
const callBtn = document.querySelector(".call");
const logoutMenuButton = document.querySelector(".logout-menu");
const logoutMenu = document.getElementById("logout-container");
const logoutButton = document.querySelector(".logout-button");
const talkingToContainer = document.querySelector(".talking-to");
const currentUserElement = document.querySelector(".current-user");
const userImage = document.querySelector(".user img");
const userTalkingTo = document.querySelector(".user-talking-to");
const mobileMenuBtn = document.querySelector(".mobile-menu");

logoutMenuButton.addEventListener("click", () => {
  logoutMenuButton.classList.toggle("rotate-arrow");
  logoutMenu.classList.toggle("slide-show");
});

logoutButton.addEventListener("click", async () => {
  await axios.post("/auth/logout", { withCredentials: true });
  window.location.href = "/";
});

mobileMenuBtn.addEventListener("click", () => {
  friends.classList.toggle("slide-in");
  friends.classList.toggle("slide-out");
  mobileMenuBtn.classList.toggle("green-color");
});

friends.innerHTML = `<h1>Loading...</h1>`;
//Decodes the token and gets the current user and then procceeds with the page load
const getCurrentUser = async () => {
  const { data } = await axios.get("/users/user", {
    withCredentials: true,
  });
  return data;
};

getCurrentUser()
  //If token couldn't verify go back to login page
  .then(async function (userInfo) {
    //display all available users to chat
    showFriends();
    const currentUser = userInfo.currentUser;
    userImage.src = "./uploads/" + userInfo.image;

    //Initialize varaibles

    let username2 = "";
    let username2Image = "";
    let roomId = "";

    currentUserElement.innerHTML = `<h3>${currentUser}</h3>`;

    //Send button functionality
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      if (message != null && message != "" && username2 != "") {
        messageInput.value = ``;
        const data = axios.post(
          "/messages/add",
          { message: message, talkingTo: username2 },
          {
            withCredentials: true,
          }
        );
        //Send message
        socket.emit("chatMessage", roomId, message, currentUser);
        const messageEl = formatMessage({
          user: currentUser,
          message: message,
        });
        messageContainer.append(messageEl);
      }
      //scroll to latest message
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });
    callBtn.addEventListener("click", () => {
      if (username2) {
        socket.emit("callUser", roomId);
        // Add call to database
        const message = `isCall`;
        if (message != null && message != "") {
          const data = axios.post(
            "/messages/add",
            { message: message, talkingTo: username2 },
            {
              withCredentials: true,
            }
          );
        }
        window.location.href = "/" + roomId + `?user=${username2}`;
      }
    });

    //When receive message
    socket.on("message", (message, currentUser) => {
      let messageEl = "";
      if (message.message == "isCall") {
        messageEl = formatMessageCall(currentUser);
        messageContainer.append(messageEl);
        const button = document.querySelector(".answer-button");
        button.addEventListener("click", () => {
          window.location.href = "/" + roomId + `?user=${username2}`;
        });
      } else {
        messageEl = formatMessage({
          user: currentUser,
          message: message,
        });
        messageContainer.append(messageEl);
      }
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    socket.on("calling", () => {
      const messageEl = formatMessageCall(username2);
      messageContainer.append(messageEl);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    //When called return all the users
    async function showFriends() {
      if (window.innerWidth < 800) {
        friends.classList.add("slide-in");
        mobileMenuBtn.classList.add("green-color");
      }
      const { data } = await axios.get("/users", {});

      friends.innerHTML = `<div class="add-friend">
      <h4>friends</h4>
    </div>`;

      // for add friend
      const addFriend = document.querySelector(".add-friend");
      const addFriendButton = document.createElement("button");
      addFriendButton.innerText = "Add";
      addFriendButton.classList.add("add-friend-button");

      //For search friend
      const friendForm = document.createElement("form");
      const friendInput = document.createElement("input");
      const searchButton = document.createElement("button");

      friendForm.classList.add("friend-form");
      friendForm.classList.add("hide");
      friendInput.classList.add("friend-input");
      friendInput.placeholder = "Enter username";
      searchButton.classList.add("search-button");
      searchButton.type = "submit";
      searchButton.innerHTML = `<i class="fa-solid fa-paper-plane"></i>`;

      friendForm.addEventListener("submit", async (e) => {
        //Get user from input and add for friend
        e.preventDefault();
        const friendToRequest = friendInput.value;
        friendInput.value = ``;
        await axios.patch(
          "/users/user",
          { friendToRequest },
          { withCredentials: true }
        );
      });
      friendForm.append(friendInput);
      friendForm.append(searchButton);

      friends.append(friendForm);

      addFriendButton.addEventListener("click", () => {
        //Show input
        friendForm.classList.toggle("hide");
      });
      addFriend.append(addFriendButton);
      data.friends.forEach((user) => {
        const friend = document.createElement("div");
        if (user.isFriend == false) {
          friend.classList.add("accept-button-container");
          const acceptButton = document.createElement("button");
          const declineButton = document.createElement("button");
          acceptButton.innerText = "accept";
          acceptButton.classList.add(`${user.username}`);
          declineButton.classList.add(`${user.username}`);
          acceptButton.addEventListener("click", async (e) => {
            //accept friend request
            let userToAccept = e.target;
            userToAccept = userToAccept.classList[0];
            await axios.patch(
              "/users",
              { userToAccept },
              { withCredentials: true }
            );
            showFriends();
          });

          // For decline button
          declineButton.innerText = "Decline";
          declineButton.addEventListener("click", async (e) => {
            //Decline friend request
            let userToDecline = e.target;
            userToDecline = userToDecline.classList[0];
            await axios.delete(
              "/users",
              { userToDecline },
              { withCredentials: true }
            );
            showFriends();
          });

          const friendImage = document.createElement("img");
          friendImage.src = "./uploads/" + user.image;
          friendImage.classList.add("friend-image");

          friend.innerHTML = `
          <h4>${user.username}</h4>
          <p>Send a friend request</p>`;
          friend.insertBefore(friendImage, friend.firstChild);
          friend.append(acceptButton);
          friend.append(declineButton);
          // friend.innerHTML = `<button>Accept</button>`;
        } else {
          friend.innerHTML = `
        <div class="username">${user.username}</div>
        <img
          src="./uploads/${user.image}"
          alt=""
        />
        <h4>${user.username}</h4>`;

          friend.classList.add("friend");

          friend.addEventListener("click", async (e) => {
            // To close the friend bar in mobile view
            if (window.innerWidth < 800) {
              friends.classList.remove("slide-in");
              friends.classList.add("slide-out");
              mobileMenuBtn.classList.remove("green-color");
            }
            messageContainer.innerHTML = ``;
            username2 = e.target.innerText;
            const { data } = await axios.post(
              "/messages",
              { talkingTo: username2 },
              {
                withCredentials: true,
              }
            );
            username2Image = await axios.post(
              "/users/image",
              {
                username2,
              },
              { withCredentials: true }
            );
            username2Image = username2Image.data;

            //For security
            // if (
            //   username2 == currentUser ||
            //   (currentUser != data.username1 && currentUser != data.username2)
            // ) {
            //   window.location.href = "index.html";
            // }
            roomId = data._id;
            socket.emit("joinRoom", roomId);

            if (data.messages) {
              const messages = data.messages;

              messages.forEach((message) => {
                let messageEl = "";
                if (message.message == "isCall") {
                  messageEl = formatMessageCall(message.user);
                  messageContainer.append(messageEl);
                } else {
                  messageEl = formatMessage(message);
                  messageContainer.append(messageEl);
                }
              });
              messageContainer.scrollTop = messageContainer.scrollHeight;

              //Add talking to in the top bar
              userTalkingTo.innerHTML = `<h3>${username2}</h3>`;
              document.getElementById("call").style.visibility = "visible";
            }
          });
        }
        friends.append(friend);
      });
    }

    //Formats the message to display in page
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
          <h4>${message.user}:</h4>
          <p>${message.message}</p>
        `;
          messageEl.classList.add("message");
        } else {
          messageEl.innerHTML = `
          <img
            src="https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
            alt=""
          />
          <h4>${message.user}:</h4>
          <p>${message.message}</p>
        `;
          messageEl.classList.add("message");
        }
      }

      return messageEl;
    }

    function formatMessageCall(user) {
      const callNotification = document.createElement("div");
      if (user != currentUser) {
        const answerButton = document.createElement("button");
        callNotification.innerHTML = `
      <img
      src="./uploads/${username2Image}"
      alt=""
    />
    <p>${user}: Requested a call</p>`;
        callNotification.classList.add("call-notification");

        answerButton.innerHTML = `<i class="fa-solid fa-phone"></i>`;
        answerButton.addEventListener("click", () => {
          window.location.href = "/" + roomId + `?user=${username2}`;
        });
        callNotification.append(answerButton);
      } else {
        callNotification.innerHTML = `
        <p>Requested a call <i class="fa-solid fa-phone"></i></p>`;
        callNotification.classList.add("my-call-notification");
      }
      return callNotification;
    }
  });
