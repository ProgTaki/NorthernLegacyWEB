document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:4545/profile", {
            method: "GET",
            credentials: "include",  // Sütik engedélyezése
        });

        if (!response.ok) {
            throw new Error("Nem sikerült lekérni a profilt.");
        }

        const data = await response.json();
        console.log("Felhasználónév:", data.username);  // Javítás: `username`-t használunk

        document.getElementById("prof-name").innerText = data.username; // Itt is `username`
    } catch (error) {
        console.error("Hiba:", error);
        document.getElementById("prof-name").innerText = "Nem vagy bejelentkezve.";
    }
});