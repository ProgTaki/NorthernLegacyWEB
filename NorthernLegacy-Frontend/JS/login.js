document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("error-message");
    const userError = document.getElementById("user-error");
    const passError = document.getElementById("pass-error");

    document.getElementById("loginButton").addEventListener("click", async () => {
        const name = document.getElementById('log_user').value.trim();
        const password = document.getElementById('log_pass').value;

        // Clear previous error messages
        userError.textContent = "";
        passError.textContent = "";
        errorMessage.textContent = "";

        // Check for empty fields
        let hasError = false;
        if (!name) {
            userError.textContent = "Required!";
            hasError = true;
        }
        if (!password) {
            passError.textContent = "Required!";
            hasError = true;
        }
        if (hasError) return; // Stop if any field is empty

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
                data = await response.json();
            } catch (jsonError) {
                console.error("Invalid JSON response:", jsonError);
                throw new Error("Failed to process server response.");
            }

            if (!response.ok) {
                if (data.error === "User does not exist") {
                    userError.textContent = "User not found!";
                } else if (data.error === "Incorrect password") {
                    passError.textContent = "Wrong password!";
                } else {
                    errorMessage.textContent = data.error || "An error occurred!";
                }
                return;
            }

            alert("Login successful!");
            localStorage.setItem('token', data.token);  
            window.location.href = 'log-index.html';

        } catch (error) {
            errorMessage.textContent = "An error occurred during login!";
            console.error("Error:", error);
        }
    });
});
