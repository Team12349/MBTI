import { validateRegister } from "./validate";

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let isValid = validateRegister();
  if (!isValid) return;

  const el = document.querySelector("#submitBtn");

  let message = "";
  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      message = data.message || "Failed to sign up.";
    } else {
      message = "Sign up successful!";
      form.reset();
    }
  } catch (err) {
    console.error("Error submitting form", err);
    message = "Server connection failed.";
  }

  if (!el) return;

  el.textContent = message;
  el.disabled = true;
  el.style.cursor = "not-allowed";

  await new Promise((resolve) => setTimeout(resolve, 3000));

  el.style.cursor = "pointer";
  el.disabled = false;
  el.textContent = "Sign up";
});
