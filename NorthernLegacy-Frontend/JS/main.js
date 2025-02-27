document.addEventListener("DOMContentLoaded", function () {

    var userStatus = localStorage.getItem("userStatus");
    console.log(userStatus)

    if (userStatus === "valid user") {
        console.log("valid user");

        document.getElementById("authLinks").style.display = "none";
        
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("userName").textContent = "Felhasználó";

        // LogOut
        /*document.getElementById("logoutLink").addEventListener("click", function () {
            console.log("User logged out");
            localStorage.removeItem("userStatus");
            location.reload();
        });*/
    }
});

