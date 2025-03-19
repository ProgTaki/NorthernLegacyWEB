document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resetPasswordForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = localStorage.getItem("resetEmail"); // Az emailt a localStorage-ból vesszük
        const verificationCode = document.getElementById("verificationCode").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!email) {
            alert("Missing email. Please restart the process.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/reset-password", {
                method: "POST",
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
