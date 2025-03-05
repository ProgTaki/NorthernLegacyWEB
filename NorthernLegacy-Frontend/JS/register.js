document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("register_button").addEventListener("click", async () => {
        const username = document.getElementById('reg_user').value;
        const email = document.getElementById('reg_email').value;
        const password = document.getElementById('reg_pass').value;
        const passworda = document.getElementById('reg_pass2').value;

        if (password !== passworda) {
            alert("Nem egyeznek a jelszavak!");
            return; // Ha nem egyeznek, ne folytassa a regisztrációt
        }

        try {
            const response = await fetch("http://127.0.0.1:4545/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            alert(data.message || "Sikeres regisztráció!");
            window.location.href = 'login.html'; // Átirányítás
        } catch (error) {
            errorMessage.textContent = "Hiba történt a regisztráció során!";
            console.error("Error:", error);
        }
    });
});