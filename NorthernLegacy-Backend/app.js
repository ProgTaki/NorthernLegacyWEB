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

// EMAIL CÍM ELLENŐRZÉS
app.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Ellenőrizzük, hogy az email létezik-e az adatbázisban
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length > 0) {
            return res.json({ exists: true });  // Az email létezik
        } else {
            return res.json({ exists: false }); // Az email nem létezik
        }
    } catch (error) {
        res.status(500).json({ error: "Error checking email" });
    }
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

        // Generáljuk a verification code-ot
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        const expiryDate = new Date(Date.now() + 10 * 60 * 1000); // 10 percig érvényes

        // Frissítjük az adatbázisban a verification code-ot és annak lejáratát
        const [result] = await db.execute(
            "UPDATE users SET verification_code = ?, code_expiry = ? WHERE email = ?",
            [verificationCode, expiryDate, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Mentsük el az adatbázisba
        await db.execute(
            "UPDATE users SET verification_code = ?, code_expiry = ? WHERE email = ?",
            [verificationCode, expiryDate, email]
        );

        // Küldjük el az emailt
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is: ${verificationCode}`
        });

        res.status(200).json({ message: "Verification code sent and saved to DB" });
    } catch (error) {
        console.error("Error in send-code:", error);
        res.status(500).json({ error: "Error sending verification code" });
    }
});



// Jelszó visszaállítás
app.post("/reset-password", async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;
        console.log("Received request body:", req.body);

        if (!email || !verificationCode || !newPassword) {
            return res.status(400).json({ error: "Email, verification code and new password are required." });
        }

        // Ellenőrizzük, hogy létezik-e az email a felhasználók között
        const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ error: "Email not found." });
        }

        const user = users[0];
        const currentTime = new Date();

        // Ellenőrizzük, hogy a verifikációs kód lejárt-e
        if (currentTime > new Date(user.code_expiry)) {
            return res.status(400).json({ error: "Verification code has expired." });
        }

        // Ellenőrizzük, hogy a verifikációs kód egyezik-e
        if (user.verification_code !== parseInt(verificationCode)) {
            return res.status(400).json({ error: "Invalid verification code." });
        }

        // Jelszó titkosítása Argon2-vel
        const hashedPassword = await argon2.hash(newPassword);

        // Jelszó frissítése az adatbázisban
        await db.execute("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

        // Nullázzuk a verifikációs kódot, hogy ne lehessen újra használni
        await db.execute("UPDATE users SET verification_code = NULL, code_expiry = NULL WHERE email = ?", [email]);

        res.json({ message: "Password has been updated successfully." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ error: "Error resetting password" });
    }
});


// Szerver indítása
app.listen(process.env.PORT, () => {
    console.log(`IP: ${process.env.HOSTNAME}:${process.env.PORT}`);
});
