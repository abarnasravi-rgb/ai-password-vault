const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");

const app = express();
app.use(cors());
app.use(express.json());

const KEY = "secret";

app.post("/register", (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 8);
    db.query("INSERT INTO users (email,password) VALUES (?,?)",
        [req.body.email, hash], () => res.send("OK"));
});

app.post("/login", (req, res) => {
    db.query("SELECT * FROM users WHERE email=?", [req.body.email], (err, result) => {
        if (!result.length) return res.json({success:false});
        const ok = bcrypt.compareSync(req.body.password, result[0].password);
        if (ok) res.json({success:true, userId: result[0].id});
        else res.json({success:false});
    });
});

app.post("/save", (req, res) => {
    const encrypted = CryptoJS.AES.encrypt(req.body.password, KEY).toString();
    db.query("INSERT INTO passwords (user_id,password) VALUES (?,?)",
        [req.body.userId, encrypted], () => res.send("Saved"));
});

app.get("/get/:id", (req, res) => {
    db.query("SELECT password FROM passwords WHERE user_id=?",
        [req.params.id],
        (err, result) => {
            const data = result.map(p => ({
                password: CryptoJS.AES.decrypt(p.password, KEY).toString(CryptoJS.enc.Utf8)
            }));
            res.json(data);
        });
});

app.listen(5000, ()=>console.log("Server running"));
