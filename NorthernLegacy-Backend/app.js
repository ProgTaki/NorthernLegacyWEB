require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const crypto = require("crypto");
const morgan = require("morgan");

const app = express();

// Biztonsági beállítások
app.use(helmet());
app.use(morgan("combined"));
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting - brute-force ellen
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Túl sok kérés, próbáld később!"
});
app.use(limiter);

// Adatbázis kapcsolat (async/await támogatással)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// REGISZTRÁCIÓ
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        
        if (users.length > 0) {
            return res.status(400).json({ message: "Ez az email már foglalt." });
        }
        
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
        await db.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);
        
        res.status(201).json({ message: "Sikeres regisztráció!" });
    } catch (error) {
        res.status(500).json({ message: "Szerverhiba", error });
    }
});

// BEJELENTKEZÉS
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    console.log("Beérkezett adatok:", req.body);

    try {
        const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [name]);

        if (users.length === 0) {
            return res.status(400).json({ message: "Érvénytelen név vagy jelszó." });
        }

        const user = users[0];

        const match = await argon2.verify(user.password, password);
        if (!match) {
            return res.status(400).json({ message: "Hibás jelszó." });
        }

        // JWT Token generálás
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        });

        // FONTOS: Itt biztosan küld vissza JSON-t!
        res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email } });

    } catch (error) {
        console.error("Bejelentkezési hiba:", error);
        res.status(500).json({ message: "Szerverhiba" });
    }
});


// PROFIL LEKÉRÉSE
app.get("/profile", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Nincs token, kérlek jelentkezz be!" });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Érvénytelen token!" });
        res.json({ username: decoded.username });
    });
});

// EMAIL KÜLDÉS
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

app.post("/send-code", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });
        
        const verificationCode = crypto.randomInt(100000, 999999);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is: ${verificationCode}`
        });
        
        res.json({ message: "Verification code sent" });
    } catch (error) {
        res.status(500).json({ error: "Error sending email" });
    }
});

// Szerver indítása
app.listen(process.env.PORT, () => {
    console.log(`IP: ${process.env.HOSTNAME}:${process.env.PORT}`);
});
/*
const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));*/
