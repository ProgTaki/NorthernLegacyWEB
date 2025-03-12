document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("error-message");

    document.getElementById("loginButton").addEventListener("click", async () => {
        const name = document.getElementById('log_user').value;
        const password = document.getElementById('log_pass').value;

        try {
            const response = await fetch("http://127.0.0.1:4545/login", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            let data;
            try {
                data = await response.json(); // JSON próbálása
            } catch (jsonError) {
                console.error("Hibás JSON válasz:", jsonError);
                throw new Error("Nem sikerült feldolgozni a szerver válaszát.");
            }

            if (!response.ok) {
                errorMessage.textContent = data.error || "Hiba történt!";
                return;
            }

            alert("Bejelentkezés sikeres!");
            localStorage.setItem('token', data.token);  
            window.location.href = 'log-index.html';

        } catch (error) {
            errorMessage.textContent = "Hiba történt a bejelentkezés során!";
            console.error("Error:", error);
        }
    });
});