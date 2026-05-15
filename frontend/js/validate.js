export function validateForm() {
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

export function validateRegister() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();
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

  if (passwordValue === "") {
    setError(passwordInput, "Password is required");
    return false;
  } else if (passwordValue.length < 6) {
    setError(passwordInput, "Password must be at least 6 characters");
    return false;
  } else {
    setSuccess(passwordInput);
  }

  return true;
}

export function validateLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  if (emailValue === "") {
    setError(emailInput, "Email is required");
    return false;
  } else if (!validateEmail(emailValue)) {
    setError(emailInput, "Please enter a valid email");
    return false;
  } else {
    setSuccess(emailInput);
  }

  if (passwordValue === "") {
    setError(passwordInput, "Password is required");
    return false;
  } else if (passwordValue.length < 6) {
    setError(passwordInput, "Password must be at least 6 characters");
    return false;
  } else {
    setSuccess(passwordInput);
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
