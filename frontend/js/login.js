import { validateLogin } from "./validate";

const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let isValid = validateLogin();
  if (!isValid) return;

  const el = document.querySelector("#submitBtn");

  let message = "";
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
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
      throw new Error(message);
    } else {
      message = "Sign up successful!";
      form.reset();
    }
  } catch (err) {
    console.error("Error submitting form", err);
    message = "Server connection failed.";
    if (!el) return;

    el.textContent = message;
    el.disabled = true;
    el.style.cursor = "not-allowed";

    await new Promise((resolve) => setTimeout(resolve, 3000));

    el.style.cursor = "pointer";
    el.disabled = false;
    el.textContent = "Sign up";
  }

  try {
    const res = await fetch("http://localhost:3000/me", {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user data.");
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch user data.");
    }
    window.location.href = "index.html";
    const user = data.user;
    hideLoginButton();
    showLogoutButton();
  } catch (err) {
    console.error("Error fetching user data", err);
  }
});

function hideLoginButton() {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.style.display = "none";
  }
}

function showLogoutButton() {
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.textContent = "Logout";
    signupBtn.onclick = async function () {
      try {
        const res = await fetch("http://localhost:3000/logout", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to log out.");
        }
        window.location.href = "index.html";
      } catch (err) {
        console.error("Error logging out", err);
      }
    };
  }
}
