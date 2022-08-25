const form = document.querySelector(".login");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector(".username-input").value;
  const password = document.querySelector(".password-input").value;
  try {
    const { data } = await axios.post("/auth/login", { username, password });
    document.querySelector(".username-input").value = "";
    document.querySelector(".password-input").value = "";
    if (data != "error") {
      window.location.href = "/home";
    }
  } catch (error) {
    console.log(error);
  }
});
