localStorage.removeItem("token");
const form = document.querySelector(".login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector(".username-input").value;
  const password = document.querySelector(".password-input").value;
  const image = document.querySelector(".image-input").files[0];

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);
  try {
    const { data } = await axios.post("/auth/register", formData);

    document.querySelector(".username-input").value = "";
    document.querySelector(".password-input").value = "";
    if (data != "error") {
      window.location.href = "/home";
    }
  } catch (error) {
    console.log(error);
  }
});
