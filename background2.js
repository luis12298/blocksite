chrome.storage.local.get(['blacklist'], (result) => {
   if (chrome.runtime.lastError) {
      console.error('Error al leer la lista negra:', chrome.runtime.lastError);
      return;
   }

   const blacklist = result.blacklist || []; // Obtén la lista negra o un arreglo vacío si no existe
   const currentUrl = window.location.href.toLowerCase().trim();

   // Verificar si ya está autenticado en esta sesión
   const isAuthenticated = sessionStorage.getItem('siteAuthenticated_' + currentUrl);
   if (isAuthenticated) {
      return; // Si ya está autenticado, no hacer nada
   }

   for (let i = 0; i < blacklist.length; i++) {
      if (currentUrl.includes(blacklist[i].toLowerCase().trim())) {
         document.body.style.display = 'none';

         const overlay = document.createElement('div');
         overlay.style.cssText = `
         position: fixed;
         top: 0;
         left: 0;
         width: 100vw;
         height: 100vh;
         background-color: rgba(0, 0, 0, 0.9);
         display: flex;
         justify-content: center;
         align-items: center;
         z-index: 9999;
      `;

         // Modal container style
         const modal = document.createElement('div');
         modal.style.cssText = `
         background-color: #ffffff;
         border-radius: 16px;
         box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
         padding: 40px;
         text-align: center;
         width: 100%;
         max-width: 400px;
         max-height: 80%;
         overflow: hidden;
         position: relative;
         opacity: 0.9;
         transition: all 0.3s ease;
      `;

         modal.innerHTML = `
      <div style="margin-bottom: 20px;">
         <h2 style="
            font-size: 24px;
            margin-bottom: 10px;
            font-weight: bold;
         ">Este sitio está bloqueado</h2>
         <p style="
            color: #666;
            font-size: 16px;
            margin-bottom: 20px;
         ">Ingrese la contraseña para continuar:</p>
      </div>
      <input 
         type="password" 
         id="passwordInput" 
         style="
            width: 100%;
            padding: 12px 15px;
            margin-bottom: 20px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.3s ease;
         "
         placeholder="Contraseña"
      />
      <button 
         id="submitPassword" 
         style="
            width: 100%;
            padding: 12px 15px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.1s ease;
         "
      >
         Aceptar
      </button>
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
                           // Marcar como autenticado en la sesión
                           sessionStorage.setItem('siteAuthenticated_' + currentUrl, 'true');
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
                  // Marcar como autenticado en la sesión
                  sessionStorage.setItem('siteAuthenticated_' + currentUrl, 'true');
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