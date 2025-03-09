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

            if (!response.ok) {
                const data = await response.json();
                errorMessage.textContent = data.message || "Hiba történt!";
                return;
            }

            const data = await response.json();
            alert("Bejelentkezés sikeres!");
            // Menthetjük a tokent a helyi tárolóba (localStorage) vagy más módon, ha szükséges
            localStorage.setItem('token', data.token);  // Mentés
            data.username
            window.location.href = 'log-index.html'; // Példa átirányítás a belső felületre
        } catch (error) {
            errorMessage.textContent = "Hiba történt a bejelentkezés során!";
            console.error("Error:", error);
        }
    });
});