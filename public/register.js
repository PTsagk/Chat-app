const form = document.querySelector(".login");
const usernameInp = document.querySelector(".username-input");
const passwordInp = document.querySelector(".password-input");
const imageInp = document.querySelector(".image-input");
const errorMessage = document.querySelector(".error-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = usernameInp.value;
  const password = passwordInp.value;
  const image = imageInp.files[0];
  if (!username) {
    usernameInp.style.border = "2px solid #c42525";
    usernameInp.placeholder = "Username is required";
  }
  if (!password) {
    passwordInp.style.border = "2px solid #c42525";
    passwordInp.placeholder = "Password is required";
  }
  if (!image) {
    imageInp.style.border = "2px solid #c42525";
  }
  if (username && password && image) {
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("image", image);
    const resp = await axios
      .post("/auth/register", formData)
      .catch((err) => console.log(err.response.data));
    usernameInp.value = "";
    passwordInp.value = "";
    if (resp) {
      window.location.href = "/home";
    } else {
      errorMessage.style.display = "";
    }
  }
});
