require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
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

    // Ellenőrizzük, hogy létezik-e már a felhasználó
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length > 0) {
            return res.status(400).json({ message: "Ez az email már foglalt." });
        }

        // Jelszó titkosítása
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Új felhasználó hozzáadása
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
        console.log(user);
        console.log(password);
        if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: "Hibás jelszó." });

        // JWT Token generálás
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user.id, username: user.username, email: user.name } });
    });
});

const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`Szerver fut a ${PORT} porton`));