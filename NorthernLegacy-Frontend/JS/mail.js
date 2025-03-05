function sendCode() {
    const email = document.getElementById("forgot-email").value; // Itt az email input értékét kérdezzük le
    const messageEl = document.getElementById("message");

    if (!email) {
        messageEl.textContent = "Please enter your email!";
        messageEl.style.color = "red";
        return;
    }

    fetch("http://127.0.0.1:4545/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            messageEl.textContent = "Verification code sent!";
            messageEl.style.color = "green";
        } else {
            messageEl.textContent = "Something went wrong!";
            messageEl.style.color = "red";
        }
    })
    .catch(error => {
        messageEl.textContent = "Failed to connect to the server.";
        messageEl.style.color = "red";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendCodeButton");
    if (button) {
        button.addEventListener("click", sendCode); // A kattintás eseményt hozzáadjuk a gombhoz
    }
});