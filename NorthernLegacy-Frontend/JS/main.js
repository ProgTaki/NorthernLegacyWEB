document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:4545/profile", {
            method: "GET",  // 🔥 FONTOS: a profile végpont GET metódust használ
            credentials: "include",  // 🔥 ENGEDÉLYEZI A SÜTIK KÜLDÉSÉT
        });

        if (!response.ok) {
            throw new Error("Nem sikerült lekérni a profilt.");
        }

        const data = await response.json();
        console.log("Felhasználónév:", data.nev);

        document.getElementById("prof-name").innerText = data.nev;
    } catch (error) {
        console.error("Hiba:", error);
        document.getElementById("prof-name").innerText = "Nem vagy bejelentkezve.";
    }
});