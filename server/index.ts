import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/form", (req, res) => {
    const { name, email, message } = req.body;
    console.log(
        `Received form submission: Name: ${name}, Email: ${email}, Message: ${message}`,
    );
    res.status(200).json({
        success: true,
        message: "Form submitted successfully!",
        data: { name, email, message },
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`Received login attempt: Username: ${username}`);
    if (username && password) {
        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: { username },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Username and password are required.",
        });
    }
});

app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    console.log(
        `Received registration attempt: Username: ${username}, Email: ${email}`,
    );
    if (username && email && password) {
        res.status(200).json({
            success: true,
            message: "Registration successful!",
            data: { username, email },
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Username, email, and password are required.",
        });
    }
});

app.use("/", (req, res) => {
    res.status(404).send("Page not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
