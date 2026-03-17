const API = "http://localhost:5000";

function generatePassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
    let pass = "";
    for (let i = 0; i < 12; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("passwordOutput").value = pass;
    checkStrength(pass);
}

function checkStrength(p) {
    let s = "Weak";
    if (p.length > 10 && /[A-Z]/.test(p)) s = "Medium";
    if (p.length > 12 && /[!@#$]/.test(p)) s = "Strong";
    document.getElementById("strength").innerText = s;
}

async function register() {
    await fetch(API + "/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: regEmail.value,
            password: regPassword.value
        })
    });
    alert("Registered");
}

async function login() {
    let res = await fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });
    let data = await res.json();
    if (data.success) {
        localStorage.setItem("userId", data.userId);
        window.location = "dashboard.html";
    }
}

async function savePassword() {
    await fetch(API + "/save", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            password: passwordOutput.value
        })
    });
    loadPasswords();
}

async function loadPasswords() {
    let res = await fetch(API + "/get/" + localStorage.getItem("userId"));
    let data = await res.json();
    let list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach(p => {
        let li = document.createElement("li");
        li.innerText = p.password;
        list.appendChild(li);
    });
}

window.onload = () => {
    if (location.pathname.includes("dashboard")) loadPasswords();
};
