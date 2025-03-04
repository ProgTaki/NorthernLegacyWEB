document.addEventListener("DOMContentLoaded", async () => {
    function sendEmail() {
        const email = document.getElementById("email").value;
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;

        fetch("http://127.0.0.1:4545/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, subject, message })
        })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => alert("Hiba történt: " + error));
    }
});