chrome.storage.local.get(['blacklist'], (result) => {
   if (chrome.runtime.lastError) {
      console.error('Error al leer la lista negra:', chrome.runtime.lastError);
      return;
   }

   const blacklist = result.blacklist || []; // Obtén la lista negra o un arreglo vacío si no existe
   const currentUrl = window.location.href.toLowerCase().trim();

   for (let i = 0; i < blacklist.length; i++) {
      if (currentUrl.includes(blacklist[i].toLowerCase().trim())) {
         document.body.style.display = 'none';

         const overlay = document.createElement('div');
         overlay.style.position = 'fixed';
         overlay.style.top = '0';
         overlay.style.left = '0';
         overlay.style.width = '100%';
         overlay.style.height = '100%';
         overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
         overlay.style.display = 'flex';
         overlay.style.justifyContent = 'center';
         overlay.style.alignItems = 'center';
         overlay.style.zIndex = '9999';

         // Modal container style
         const modal = document.createElement('div');
         modal.style.backgroundColor = 'white';
         modal.style.padding = '30px';
         modal.style.borderRadius = '10px';
         modal.style.textAlign = 'center';
         modal.style.color = 'black';
         modal.style.minWidth = '300px'; // Establece un tamaño mínimo fijo
         modal.style.maxWidth = '400px'; // Limita el tamaño máximo
         modal.style.width = '100%'; // Asegura que el modal ocupe todo el ancho posible dentro del rango

         modal.innerHTML = `
               <h2>Este sitio está bloqueado</h2>
               <h1>Ingrese la contraseña para continuar:</h1>
               <input type="password" id="passwordInput" style="padding: 8px; width: 90%; margin-bottom: 20px;" />
               <button id="submitPassword" style="padding: 10px 10px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Aceptar</button>
           `;

         overlay.appendChild(modal);
         document.documentElement.appendChild(overlay);

         const passwordInput = document.getElementById('passwordInput');
         const submitButton = document.getElementById('submitPassword');

         submitButton.addEventListener('click', () => {
            const inputPassword = passwordInput.value.trim();

            if (inputPassword === "") {
               alert("Por favor, ingrese una contraseña.");
               return;
            }

            // Leer la contraseña desde chrome.storage
            chrome.storage.local.get(['password'], (result) => {
               if (chrome.runtime.lastError) {
                  console.error('Error al leer la contraseña:', chrome.runtime.lastError);
                  alert("Error al verificar la contraseña.");
                  return;
               }

               const storedPassword = result.password;

               if (!storedPassword) {
                  if (confirm("No hay contraseña configurada. ¿Desea configurarla ahora?")) {
                     // Configurar una nueva contraseña
                     chrome.storage.local.set({ password: inputPassword }, () => {
                        if (chrome.runtime.lastError) {
                           console.error('Error al guardar la contraseña:', chrome.runtime.lastError);
                           alert("Error al configurar la contraseña.");
                        } else {
                           alert("Contraseña configurada correctamente.");
                           document.body.style.display = '';
                           document.documentElement.removeChild(overlay);
                        }
                     });
                  }
                  return;
               }

               if (inputPassword !== storedPassword.trim()) {
                  alert("Contraseña incorrecta.");
                  passwordInput.value = "";
                  return;
               } else {
                  document.body.style.display = '';
                  document.documentElement.removeChild(overlay);
               }
            });
         });

         passwordInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
               event.preventDefault();
               submitButton.click();
            }
         });

         break;
      }
   }
});
