const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
let profileButton;
let profilePopup;

function clearStoredUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
}

function removeProfileMenu() {
  profileButton?.remove();
  profilePopup?.remove();
  profileButton = undefined;
  profilePopup = undefined;
}

function createProfileMenu(user) {
  removeProfileMenu();

  profileButton = document.createElement("button");
  profileButton.type = "button";
  profileButton.className = "profile-button";
  profileButton.textContent = (user.username || user.email || "U").trim().charAt(0).toUpperCase();

  profilePopup = document.createElement("div");
  profilePopup.className = "profile-popup";
  profilePopup.hidden = true;

  const username = document.createElement("strong");
  username.textContent = user.username || "User";

  const email = document.createElement("span");
  email.textContent = user.email || "No email found";

  const logoutButton = document.createElement("button");
  logoutButton.type = "button";
  logoutButton.className = "logout-account-button";
  logoutButton.textContent = "Logout";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-account-button";
  deleteButton.textContent = "Delete account";

  profilePopup.append(username, email, logoutButton, deleteButton);

  profileButton.addEventListener("click", () => {
    profilePopup.hidden = !profilePopup.hidden;
  });

  logoutButton.addEventListener("click", logout);
  deleteButton.addEventListener("click", deleteAccount);
  signupBtn.parentElement.append(profileButton, profilePopup);
}

function removeLoginButtons() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  loginBtn.style.display = "none";
  signupBtn.style.display = "none";
  createProfileMenu(user);
}

function showLoggedOutState() {
  clearStoredUser();
  loginBtn.style.display = "inline-block";
  signupBtn.style.display = "inline-block";
  signupBtn.textContent = "Sign up";
  signupBtn.href = "signup.html";
  removeProfileMenu();
}

async function updateAuthButtons() {
  if (!loginBtn || !signupBtn) return;
  if (localStorage.getItem("isLoggedIn") !== "true") return;

  removeLoginButtons();

  try {
    const res = await fetch("http://localhost:3000/me", {
      credentials: "include",
    });

    if (!res.ok) {
      showLoggedOutState();
      return;
    }

    const data = await res.json();
    if (!data.success) {
      showLoggedOutState();
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(data.user));
    createProfileMenu(data.user);
  } catch (err) {
    console.error("Error checking auth state", err);
  }
}

async function deleteAccount() {
  const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone.");
  if (!confirmed) return;

  try {
    const res = await fetch("http://localhost:3000/me", {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete account.");
    }

    showLoggedOutState();
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error deleting account", err);
  }
}

async function logout(e) {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to log out.");
    }

    showLoggedOutState();
    window.location.href = "index.html";
  } catch (err) {
    console.error("Error logging out", err);
  }
}

updateAuthButtons();
