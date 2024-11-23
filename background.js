
fetch(chrome.runtime.getURL('urls.json'))
   .then(response => {
      if (!response.ok) {
         throw new Error('No se pudo cargar el archivo JSON');
      }
      return response.json();
   })
   .then(data => {
      const blacklist = data.urls;
      console.log("Bloqueando sitios en base al JSON:", blacklist);

      (function () {
         console.log("Yaew, Yet Another Extension to block Websites - Iesus s2");

         const url = window.location.href.toLowerCase().trim();

         // Verifica si alguna de las URLs de la lista está en la URL actual
         for (let i = 0; i < blacklist.length; i++) {
            if (url.includes(blacklist[i].toLowerCase())) {
               // Solicita la contraseña al usuario si se encuentra un sitio bloqueado
               const password = prompt("Este sitio está bloqueado. Ingrese la contraseña para continuar:");

               // Verifica si la contraseña es correcta (por ejemplo, "ROOT")
               if (password !== "ROOT") {
                  alert("Contraseña incorrecta. Redirigiendo...");
                  window.location.replace('about:blank'); // Redirige si la contraseña es incorrecta
               } else {
                  alert("Acceso concedido.");
               }
               break; // Sale del ciclo si se encuentra un sitio bloqueado
            }
         }
      })();
   })
   .catch(err => {
      console.error('Error al cargar el archivo JSON:', err);
   });
