async function sendCode() {
    const email = document.getElementById("forgot-email").value;
    const messageEl = document.getElementById("message");
    const button = document.getElementById("sendCodeButton");

    if (!email) {
        messageEl.textContent = "Please enter your email!";
        messageEl.style.color = "red";
        return;
    }

    button.disabled = true;  // Gomb letiltása
    button.textContent = "Sending...";

    try {
        const response = await fetch("http://127.0.0.1:4545/api/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.message) {
            messageEl.textContent = "Verification code sent!";
            messageEl.style.color = "green";
        } else {
            messageEl.textContent = "Something went wrong!";
            messageEl.style.color = "red";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        messageEl.textContent = "Failed to connect to the server.";
        messageEl.style.color = "red";
    } finally {
        button.disabled = false;  // Gomb újra engedélyezése
        button.textContent = "Send Code";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendCodeButton");

    if (button) {
        button.replaceWith(button.cloneNode(true)); // Eltávolít minden előző event listener-t
        document.getElementById("sendCodeButton").addEventListener("click", sendCode);
    }
});