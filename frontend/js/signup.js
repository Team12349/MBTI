import { validateRegister } from "./validate.js";

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isValid = validateRegister();
  if (!isValid) return;

  try {
    const res = await fetch(`http://localhost:3000/register`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username: nameInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        password: passwordInput.value.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to sign up.");
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(data.data));
    window.location.href = "index.html";
    return;
  } catch (err) {
    submitBtn.textContent = err.message;
    submitBtn.disabled = true;
    submitBtn.style.cursor = "not-allowed";

    await new Promise((resolve) => setTimeout(resolve, 3000));

    submitBtn.style.cursor = "pointer";
    submitBtn.disabled = false;
    submitBtn.textContent = "Sign up";
  }
});

function checkAuthState() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
    return;
  }
}
checkAuthState();
