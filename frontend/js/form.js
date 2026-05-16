import { validateForm } from "./validate.js";

const apiOrigin = `http://${window.location.hostname}:3000`;

let links = document.querySelectorAll(".navbar a");

links.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

const form = document.getElementById("feedback-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let isValid = validateForm();
  if (!isValid) return;

  const el = document.querySelector("#submitBtn");
  if (!el) return;

  let message = "";
  try {
    const res = await fetch(`${apiOrigin}/form`, {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      message = "Failed to submit feedback.";
    } else {
      message = "Thank you for your feedback!";
      form.reset();
    }
  } catch (err) {
    console.error("Error submitting form", err);
    message = "Server connection failed.";
  }

  el.textContent = message;
  el.disabled = true;
  el.style.cursor = "not-allowed";

  await new Promise((resolve) => setTimeout(resolve, 3000));

  el.style.cursor = "pointer";
  el.disabled = false;
  el.textContent = "Submit";
});
