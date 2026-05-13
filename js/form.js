let links = document.querySelectorAll(".navbar a");

links.forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

const form = document.getElementById("feedback-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let isValid = validateInputs();
  if (!isValid) return;

  const el = document.querySelector("#submitBtn");
  if (!el) return;

  let message = "";
  try {
    const res = await fetch("http://localhost:3000/form", {
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

function validateInputs() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  const emailValue = emailInput.value.trim();
  const messageValue = messageInput.value.trim();
  const nameValue = nameInput.value.trim();

  if (nameValue === "") {
    setError(nameInput, "Name is required");
    return false;
  } else if (nameValue.length < 3) {
    setError(nameInput, "Name must be at least 3 characters");
    return false;
  } else {
    setSuccess(nameInput);
  }

  if (emailValue === "") {
    setError(emailInput, "Email is required");
    return false;
  } else if (!validateEmail(emailValue)) {
    setError(emailInput, "Please enter a valid email");
    return false;
  } else {
    setSuccess(emailInput);
  }

  if (messageValue === "") {
    setError(messageInput, "Message is required");
    return false;
  } else if (messageValue.length < 10) {
    setError(messageInput, "Message must be at least 10 characters");
    return false;
  } else {
    setSuccess(messageInput);
  }

  return true;
}

function setError(input, message) {
  const parent = input.parentElement;
  const small = parent.querySelector("small");

  input.classList.add("error-border");
  small.innerText = message;
}

function setSuccess(input) {
  const parent = input.parentElement;
  const small = parent.querySelector("small");

  input.classList.remove("error-border");
  small.innerText = "";
}

function validateEmail(email) {
  let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  return pattern.test(email);
}

function hasNumber(password) {
  let pattern = /[0-9]/;
  return pattern.test(password);
}
