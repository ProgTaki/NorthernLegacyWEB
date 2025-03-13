document.addEventListener("DOMContentLoaded", () => {
    const errorMessage = document.getElementById("error-message");
    const userError = document.getElementById("user-error");
    const emailError = document.getElementById("email-error");
    const passError = document.getElementById("pass-error");
    const passConfirmError = document.getElementById("pass2-error");

    document.getElementById("register_button").addEventListener("click", async () => {
        const username = document.getElementById('reg_user').value.trim();
        const email = document.getElementById('reg_email').value.trim();
        const password = document.getElementById('reg_pass').value;
        const confirmPassword = document.getElementById('reg_pass2').value;

        // Clear previous error messages
        userError.textContent = "";
        emailError.textContent = "";
        passError.textContent = "";
        passConfirmError.textContent = "";
        errorMessage.textContent = "";

        // Check for empty fields (now using the 'required' attribute in HTML)
        let hasError = false;
        if (!username) {
            userError.textContent = "Required!";
            hasError = true;
        }
        if (!email) {
            emailError.textContent = "Required!";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = "Invalid email format!";
            hasError = true;
        }
        if (!password) {
            passError.textContent = "Required!";
            hasError = true;
        } else if (password.length < 6) {
            passError.textContent = "Password must be at least 6 characters!";
            hasError = true;
        }
        if (!confirmPassword) {
            passConfirmError.textContent = "Required!";
            hasError = true;
        } else if (confirmPassword !== password) {
            passConfirmError.textContent = "Passwords do not match!";
            hasError = true;
        }
        if (hasError) return; // Stop if any field is invalid

        try {
            const response = await fetch("http://127.0.0.1:4545/register", {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            // Try parsing the response safely
            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error("Invalid JSON response:", jsonError);
                throw new Error("Failed to process server response.");
            }

            // Handle errors properly
            if (!response.ok) {
                if (data.error) {
                    if (data.error.includes("User already exists")) {
                        userError.textContent = "Username is already taken!";
                    } else if (data.error.includes("Email already in use")) {
                        emailError.textContent = "Email is already registered!";
                    } else {
                        errorMessage.textContent = data.error;
                    }
                } else {
                    errorMessage.textContent = "An unknown error occurred!";
                }
                return;
            }

            alert("Registration successful!");
            window.location.href = 'login.html';

        } catch (error) {
            errorMessage.textContent = error.message || "An error occurred during registration!";
            console.error("Error:", error);
        }
    });
});
