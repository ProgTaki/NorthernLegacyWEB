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

app.post("/send-email", async (req, res) => {
    const { email, subject, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sajatemail@gmail.com",
        pass: "app_jelszo" // Használj App Password-öt!
      }
    });
  
    const mailOptions = {
      from: "sajatemail@gmail.com",
      to: email,
      subject: subject,
      text: message
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "E-mail elküldve!" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Hiba történt!", error });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server fut a ${PORT} porton...`);
});


const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));
