const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let isValid = validateInputs();

        if (isValid) {
            window.location.href = "index.html";
        }
    });
}

function validateInputs() {
    let valid = true;

    let nameValue = nameInput.value.trim();
    let emailValue = emailInput.value.trim();
    let passwordValue = passwordInput.value.trim();

    if (nameValue === "") {
        setError(nameInput, "Name is required");
        valid = false;
    } else if (nameValue.length < 3) {
        setError(nameInput, "Name must be at least 3 characters");
        valid = false;
    } else {
        setSuccess(nameInput);
    }

    if (emailValue === "") {
        setError(emailInput, "Email is required");
        valid = false;
    } else if (!validateEmail(emailValue)) {
        setError(emailInput, "Invalid email");
        valid = false;
    } else {
        setSuccess(emailInput);
    }

    if (passwordValue === "") {
        setError(passwordInput, "Password is required");
        valid = false;
    } else if (passwordValue.length < 6) {
        setError(passwordInput, "Password must be at least 6 characters");
        valid = false;
    } else {
        setSuccess(passwordInput);
    }

    return valid;
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