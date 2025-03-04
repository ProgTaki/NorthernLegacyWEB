window.onload = async () => {
    try {
        // API hívás a backend /profile végpontjához
        const response = await fetch('http://localhost:4545/profile', {
            method: 'GET',
            credentials: 'include', // Sütik küldése
        });

        if (response.ok) {
            const data = await response.json();
            const username = data.nev;  // A válaszban szereplő név

            // Megkeressük a megfelelő HTML elemet és frissítjük a nevet
            const usernameElement = document.getElementById('prof-name'); // Feltételezve, hogy az id 'prof-name'
            if (usernameElement) {
                usernameElement.textContent = username;  // A név beállítása
            }
        } else {
            console.log('Hiba a profil lekérése során:', response.statusText);
        }
    } catch (error) {
        console.error('Hiba történt a kérés során:', error);
    }
};