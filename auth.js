require("dotenv").config(); // Paling atas

const express = require("express");
const mysql = require("mysql2");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Koneksi Database Menggunakan Environment Variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "makna_pilar_db"
});

db.connect((err) => {
    if (err) {
        console.error("Gagal terhubung ke database:", err.message);
    } else {
        console.log(`Terhubung ke database MySQL (${process.env.DB_NAME || "makna_pilar_db"})`);
    }
});


// Helper function untuk enkripsi MD5
function hashMD5(text) {
    return crypto.createHash("md5").update(text).digest("hex");
}

// Regex Validasi Password: Min 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;


// =============================================================
// 1. ENDPOINT REGISTER
// =============================================================
app.post("/api/register", (req, res) => {
    const { name, email, phone_number, password } = req.body;

    if (!name || !email || !phone_number || !password) {
        return res.status(400).json({ message: "Semua kolom wajib diisi!" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password harus minimal 8 karakter, mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka!"
        });
    }

    const hashedPassword = hashMD5(password);

    const query = `
		INSERT INTO users (name, email, phone_number, password, role)
		VALUES (?, ?, ?, ?, 'customer')
	`;

    db.query(query, [name, email, phone_number, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Email sudah terdaftar!" });
            }
            return res.status(500).json({ message: "Gagal mendaftarkan user", error: err.message });
        }

        res.status(201).json({
            message: "Registrasi berhasil! Silakan login.",
            userId: result.insertId
        });
    });
});


// =============================================================
// 2. ENDPOINT LOGIN
// =============================================================
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi!" });
    }

    const hashedPassword = hashMD5(password);

    const query = `
		SELECT id, name, email, phone_number, profile_picture, role
		FROM users
		WHERE email = ? AND password = ?
	`;

    db.query(query, [email, hashedPassword], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Email atau password salah!" });
        }

        const user = results[0];
        res.status(200).json({
            message: "Login berhasil!",
            user: user
        });
    });
});


// =============================================================
// 3. ENDPOINT UPDATE PROFILE
// =============================================================
app.put("/api/profile/:id", (req, res) => {
    const userId = req.params.id;
    const { phone_number, password, profile_picture } = req.body;

    if (!phone_number) {
        return res.status(400).json({ message: "Nomor telepon tidak boleh kosong!" });
    }

    // Jika ada password baru, validasi dan hash MD5
    if (password && password.trim() !== "") {
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password baru harus minimal 8 karakter, mengandung minimal 1 huruf besar, 1 huruf kecil, dan 1 angka!"
            });
        }

        const hashedPassword = hashMD5(password);
        const queryWithPassword = `
			UPDATE users
			SET phone_number = ?, password = ?, profile_picture = COALESCE(?, profile_picture)
			WHERE id = ?
		`;

        db.query(queryWithPassword, [phone_number, hashedPassword, profile_picture, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: "Gagal update profile", error: err.message });
            }
            return res.status(200).json({ message: "Profile & password berhasil diperbarui!" });
        });
    } else {
        // Update tanpa mengubah password
        const queryWithoutPassword = `
			UPDATE users
			SET phone_number = ?, profile_picture = COALESCE(?, profile_picture)
			WHERE id = ?
		`;

        db.query(queryWithoutPassword, [phone_number, profile_picture, userId], (err) => {
            if (err) {
                return res.status(500).json({ message: "Gagal update profile", error: err.message });
            }
            return res.status(200).json({ message: "Profile berhasil diperbarui!" });
        });
    }
});

// Rute pengetesan root
app.get("/", (req, res) => {
    res.send("Server Backend Makna x Pilar aktif dan berjalan normal! 🚀");
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Auth running at: http://localhost:${PORT}`);
});