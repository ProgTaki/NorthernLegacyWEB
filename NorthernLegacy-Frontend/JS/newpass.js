document.addEventListener("DOMContentLoaded", function () {
    const changePasswordButton = document.getElementById("changePasswordButton");
    const codeInput = document.getElementById("verification_code");
    const newPasswordInput = document.getElementById("new_password");
    const confirmPasswordInput = document.getElementById("confirm_new_password");
    const message = document.getElementById("message");
    let userEmail = sessionStorage.getItem("resetEmail");

    if (!userEmail) {
        console.error("No reset email found in session storage!");
    }

    changePasswordButton.addEventListener("click", async function (e) {
        e.preventDefault();

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            message.textContent = "Passwords do not match!";
            message.style.color = "red";
            return;
        }

        const requestData = {
            email: userEmail,
            verificationCode: codeInput.value,
            newPassword: newPasswordInput.value
        };

        console.log("Sending request data:", requestData);

        const response = await fetch("http://127.0.0.1:4545/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: userEmail,
                verificationCode: codeInput.value,
                newPassword: newPasswordInput.value
            })
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (data.message) {
            message.textContent = "Password changed successfully.";
            message.style.color = "green";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            message.textContent = "Error: " + data.error;
            message.style.color = "red";
        }
    });
});
