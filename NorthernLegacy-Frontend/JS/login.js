document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("error-message");

    document.getElementById("loginButton").addEventListener("click", async () => {
        const name = document.getElementById('log_user').value;
        const password = document.getElementById('log_pass').value;

        try {
            const response = await fetch("http://localhost:4545/login", {
                method: "POST",
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
            localStorage.setItem('token', data.token);  // Mentés például
            data.username
            window.location.href = 'log-index.html'; // Példa átirányítás a belső felületre
        } catch (error) {
            errorMessage.textContent = "Hiba történt a bejelentkezés során!";
            console.error("Error:", error);
        }
    });
});
/*document.addEventListener("DOMContentLoaded", () => {

    const login = async () => {

        let username = document.getElementById('log_user').value;
        let password = document.getElementById('log_pass').value;

        try {
            const response = await fetch("http://localhost:4545/login", {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result === "valid")
                console.log("valid user"),
                window.location.href = 'log-index.html';
            else 
                console.log("nem valid user");


        } catch (error) {
            console.error("Error:", error);
        }
    };

    document.getElementById("loginButton").addEventListener("click", login);
});*/