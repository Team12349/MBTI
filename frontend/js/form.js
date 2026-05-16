import { validateForm } from "./validate.js";

const form = document.getElementById("feedback-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let isValid = validateForm();
  if (!isValid) return;

  const el = document.querySelector("#submitBtn");
  if (!el) return;

  let message = "";
  try {
    const res = await fetch("http://localhost:3000/form", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim().toLowerCase(),
        message: document.getElementById("message").value.trim(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to submit form.");
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
