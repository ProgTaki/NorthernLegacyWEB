require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

const app = express();
const FRONTEND_ORIGIN = "http://127.0.0.1:5500"; // Live Server URL-je

const corsOptions = {
    origin: FRONTEND_ORIGIN,
    credentials: true,  // Fontos, hogy a sütik átmenjenek
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/Downloads", express.static(__dirname + "/Downloads"));

// Adatbázis kapcsolat
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Hiba az adatbázis kapcsolatnál:", err);
    } else {
        console.log("MySQL adatbázis csatlakoztatva!");
    }
});

// REGISZTRÁCIÓ
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: "Ez az email már foglalt." });
        }

        // Jelszó titkosítása
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ message: "Szerverhiba" });
                res.status(201).json({ message: "Sikeres regisztráció!" });
            }
        );
    });
});

// BEJELENTKEZÉS
app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    db.query("SELECT * FROM users WHERE username = ?", [name], async (err, results) => {
        if (results.length === 0) {
            return res.status(400).json({ message: "Érvénytelen név vagy jelszó." });
        }

        const user = results[0];
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Hibás jelszó." });
        }

        // JWT Token generálás
        const token = jwt.sign({ id: user.id, nev: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,  // HTTPS esetén kell
            sameSite: "Lax",  // Ha a frontend másik domainen van, ez szükséges
        });

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    });
});

// PROFIL LEKÉRÉSE
app.get("/profile", (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Nincs token, kérlek jelentkezz be!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Érvénytelen token, kérlek jelentkezz be újra!" });
        }

        res.json({ nev: decoded.nev });
    });
});

//email - elfelejtett jelszó
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "northernlegacygame@gmail.com",
        pass: "gsqi nazq pfbr cnqr"
    },
    pool : false, // duplikáció elkerülése
});

app.post("/api/send-code", async (req, res) => {
    if (res.headersSent) return;
    console.log('Request body:', req.body); // Naplózd a bejövő adatokat
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
        from: "northernlegacygame@gmail.com",
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${verificationCode}`
    };

    try {
        console.log("Sending email...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 másodperc késleltetés
        await transporter.sendMail(mailOptions);
        console.log("Email sent.");
        res.json({ message: "Verification code sent" });
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).json({ error: "Error sending email" });
    }
});



const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));
