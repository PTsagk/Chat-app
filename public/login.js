const form = document.querySelector(".login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector(".username-input").value;
  const password = document.querySelector(".password-input").value;
  const resp = await axios
    .post("/auth/login", { username, password })
    .catch((err) => console.log(err));
  if (resp) {
    window.location.href = "/home";
  }
  document.querySelector(".username-input").value = "";
  document.querySelector(".password-input").value = "";
});
