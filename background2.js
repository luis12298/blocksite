fetch(chrome.runtime.getURL('urls.json'))
   .then(response => {
      if (!response.ok) {
         throw new Error('No se pudo cargar el archivo JSON');
      }
      return response.json();
   })
   .then(data => {
      const blacklist = data.urls.map(url => url.toLowerCase().trim());

      const url = window.location.href.toLowerCase().trim();

      for (let i = 0; i < blacklist.length; i++) {
         if (url.includes(blacklist[i])) {
            // Ocultar el contenido del body pero permitir mostrar el overlay
            document.body.style.display = 'none';

            // Crear el overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = '9999';
            overlay.style.color = 'white';

            overlay.innerHTML = `
          <div style="background: white; padding: 20px; border-radius: 10px; text-align: center; color: black;">
            <h2>Este sitio está bloqueado</h2>
            <h1>Ingrese la contraseña para continuar:</h1>
            <input type="password" id="passwordInput" style="padding: 8px; width: 90%; margin-bottom: 20px;" />
            <button id="submitPassword" style="padding: 10px 10px; background: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">Aceptar</button>
          </div>
        `;

            document.documentElement.appendChild(overlay); // Asegurarse de que el overlay esté visible
            const passwordInput = document.getElementById('passwordInput');
            const submitButton = document.getElementById('submitPassword');
            // Escuchar el evento del botón
            submitButton.addEventListener('click', () => {
               const password = passwordInput.value;

               if (passwordInput.value === "") {
                  alert("Por favor, ingrese una contraseña.");
                  return;
               }
               if (password !== "ROOT") {
                  alert("Contraseña incorrecta. Redirigiendo...");
                  window.location.replace('about:blank'); // Redirigir si la contraseña es incorrecta
               } else {
                  alert("Acceso concedido.");
                  document.body.style.display = ''; // Mostrar el contenido del body
                  document.documentElement.removeChild(overlay); // Eliminar el overlay
               }
            });

            // Escuchar el evento de tecla Enter en el input
            passwordInput.addEventListener('keypress', (event) => {
               if (event.key === 'Enter') {
                  event.preventDefault();
                  submitButton.click();
               }
            });

            break;
         }
      }
   })
   .catch(err => {
      console.error('Error al cargar el archivo JSON:', err);
   });
