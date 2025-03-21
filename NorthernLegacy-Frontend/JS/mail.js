async function sendCode(event) {
    event?.preventDefault(); // Ha egy formból hívják, megakadályozzuk a duplikált küldést

    const email = document.getElementById("forgot-email").value;
    const messageEl = document.getElementById("message");
    const button = document.getElementById("sendCodeButton");

    // Email formátum ellenőrzés
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailPattern.test(email)) {
        messageEl.textContent = "Please enter a valid email address!";
        messageEl.style.color = "red";
        return;
    }

    if (button.disabled) return; // Ha már folyamatban van egy küldés, ne induljon újra
    localStorage.setItem("resetEmail", email); // Email mentése
    button.disabled = true;
    button.textContent = "Sending...";

    try {
        const response = await fetch("http://127.0.0.1:4545/check-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.exists) { // Ha létezik az email
            const sendCodeResponse = await fetch("http://127.0.0.1:4545/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const sendCodeData = await sendCodeResponse.json();

            if (sendCodeData.message) {
                messageEl.textContent = "Verification code sent!";
                messageEl.style.color = "green";

                setTimeout(() => {
                    window.location.href = "newpassword.html"; // Céloldal átirányítása sikeres küldés esetén
                }, 5000); // Várunk 5 másodpercet a átirányításhoz
            } else {
                messageEl.textContent = "Something went wrong!";
                messageEl.style.color = "red";
            }
        } else {
            messageEl.textContent = "Email not found!";
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
});
