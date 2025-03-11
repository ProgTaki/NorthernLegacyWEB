async function sendCode(event) {
    event?.preventDefault(); // Ha egy formból hívják, megakadályozzuk a duplikált küldést

    const email = document.getElementById("forgot-email").value;
    const messageEl = document.getElementById("message");
    const button = document.getElementById("sendCodeButton");

    if (!email) {
        messageEl.textContent = "Please enter your email!";
        messageEl.style.color = "red";
        return;
    }

    if (button.disabled) return; // Ha már folyamatban van egy küldés, ne induljon újra

    button.disabled = true;
    button.textContent = "Sending...";

    try {
        const response = await fetch("http://127.0.0.1:4545/send-code", {
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
        setTimeout(() => {
            button.disabled = false;
            button.textContent = "Send Code";
        }, 2000); // Kis késleltetés, hogy ne lehessen spamolni
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("sendCodeButton");

    if (button) {
        button.replaceWith(button.cloneNode(true)); // Eltávolít minden régi event listener-t
        const newButton = document.getElementById("sendCodeButton"); // Újra lekérjük az ID-t
        newButton.addEventListener("click", sendCode);
    }

    document.getElementById("sendCodeButton").addEventListener("click", () => {
        setTimeout(() => {
            window.location.href = "newpassword.html";
        }, 10000); // 5000ms = 5 másodperc
    });
})