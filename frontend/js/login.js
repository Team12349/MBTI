import { validateLogin } from "./validate.js";

const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isValid = validateLogin();
  if (!isValid) return;

  try {
    const res = await fetch("/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email: emailInput.value.trim().toLowerCase(),
        password: passwordInput.value.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to log in.");
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(data.data));
    window.location.href = "index.html";
    return;
  } catch (err) {
    console.error("Error submitting form", err);

    submitBtn.textContent = err.message || "Server connection failed.";
    submitBtn.disabled = true;
    submitBtn.style.cursor = "not-allowed";

    await new Promise((resolve) => setTimeout(resolve, 3000));

    submitBtn.style.cursor = "pointer";
    submitBtn.disabled = false;
    submitBtn.textContent = "Log in";
  }
});

function checkAuthState() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "index.html";
    return;
  }
}
checkAuthState();
