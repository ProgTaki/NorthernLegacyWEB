function toggleStats() {
    let stats1 = document.getElementById("stats1");
    let stats2 = document.getElementById("stats2");
    
    if (stats1.style.display === "none") {
        stats1.style.display = "block";
        stats2.style.display = "none";
        setTimeout(() => stats1.classList.add("show"), 10);
        stats2.classList.remove("show");
    } else {
        stats1.style.display = "none";
        stats2.style.display = "block";
        setTimeout(() => stats2.classList.add("show"), 10);
        stats1.classList.remove("show");
    }
}