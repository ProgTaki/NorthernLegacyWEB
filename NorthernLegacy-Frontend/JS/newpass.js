document.addEventListener("DOMContentLoaded", () => {
    const changePasswordButton = document.getElementById("changePasswordButton");

    changePasswordButton.addEventListener("click", async () => {
        const email = localStorage.getItem("resetEmail");
        const verificationCode = document.getElementById("verification_code").value;
        const newPassword = document.getElementById("new_password").value;
        const confirmPassword = document.getElementById("confirm_new_password").value;
        console.log(sessionStorage.getItem("resetEmail"));
        if (!email) {
            alert("Missing email. Please restart the process.");
            return;
        }

        if (!verificationCode) {
            alert("Please enter the verification code.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:4545/reset-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, verificationCode, newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Password successfully updated! Redirecting to login...");
                localStorage.removeItem("resetEmail"); // Töröljük a localStorage-ból az emailt
                window.location.href = "login.html"; // Átirányítás a bejelentkezési oldalra
            } else {
                alert(data.error || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
