const form = document.querySelector(".login");
const usernameInp = document.querySelector(".username-input");
const passwordInp = document.querySelector(".password-input");
const errorMessage = document.querySelector(".error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInp.value;
  const password = passwordInp.value;
  if (!username) {
    usernameInp.style.border = "2px solid #c42525";
    usernameInp.placeholder = "Username is required";
  }
  if (!password) {
    passwordInp.style.border = "2px solid #c42525";
    passwordInp.placeholder = "Password is required";
  }
  const resp = await axios
    .post("/auth/login", { username, password })
    .catch((err) => console.log(err));
  if (resp) {
    window.location.href = "/home";
  } else {
    errorMessage.style.display = "";
  }
  usernameInp.value = "";
  passwordInp.value = "";
});
