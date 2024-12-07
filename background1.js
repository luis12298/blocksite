
(function () {
   console.log("Yaew, Yet Another Extension to block Websites - Iesus s2");

   // List of websites to block
   const blacklist = ["youtube.com", "facebook.com", "instagram.com", "web.whatsapp.com"];

   // Get the current URL in lowercase for case-insensitive matching
   const url = window.location.href.toLowerCase().trim();

   // Check if any blacklisted site is in the current URL
   for (let i = 0; i < blacklist.length; i++) {
      if (url.includes(blacklist[i])) {
         // Prompt the user for the root password
         const password = prompt("Este sitio está bloqueado. Ingrese la contraseña para continuar:");

         // Check if the password is correct (for example, "ROOT")
         if (password !== "ROOT") {
            alert("Contraseña incorrecta. Redirigiendo...");
            window.location.replace('about:blank'); // Redirect if the password is incorrect
         } else {
            alert("Acceso concedido.");
         }
         break; // Exit the loop once a match is found
      }
   }
})();
