const btn = document.getElementById('getUrl');
const btnExport = document.getElementById('export');
const mensaje = document.querySelector('.Mensaje');

document.addEventListener('DOMContentLoaded', () => {
   initializeButton();
});

// Evento de clic del botón
btn.addEventListener('click', () => {
   handleUrlToggle();
});

btnExport.addEventListener('click', () => {
   ExportarBlacklist();
});
// Función para inicializar el estado del botón
function initializeButton() {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = new URL(tabs[0].url).origin;

      chrome.storage.local.get(['blacklist'], (result) => {
         if (chrome.runtime.lastError) {
            showError('Error al acceder al almacenamiento');
            return;
         }

         const blacklist = result.blacklist || [];
         // Verifica si la URL actual está en la lista negra
         if (blacklist.includes(currentUrl)) {
            btn.textContent = "Desbloquear URL"; // La URL está bloqueada
         } else {
            btn.textContent = "Bloquear URL"; // La URL no está bloqueada
         }
      });
   });
}

// Función para alternar entre bloquear y desbloquear la URL
function handleUrlToggle() {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]; // Store the current tab
      const currentUrl = new URL(currentTab.url).origin;

      chrome.storage.local.get(['blacklist'], (result) => {
         if (chrome.runtime.lastError) {
            showError('Error al acceder al almacenamiento');
            return;
         }

         const blacklist = result.blacklist || [];
         if (blacklist.includes(currentUrl)) {
            // If URL is in blacklist, ask for password to unblock
            askForPassword(() => {
               const updatedBlacklist = blacklist.filter(url => url !== currentUrl);
               chrome.storage.local.set({ blacklist: updatedBlacklist }, () => {
                  if (chrome.runtime.lastError) {
                     showError('Error al desbloquear la URL');
                  } else {
                     updateButtonAndMessage("Bloquear URL", "URL desbloqueada correctamente");
                  }
               });
            });
         } else {
            // If URL is not in blacklist, add it
            blacklist.push(currentUrl);
            chrome.storage.local.set({ blacklist }, () => {
               if (chrome.runtime.lastError) {
                  showError('Error al guardar la URL');
               } else {
                  updateButtonAndMessage("Desbloquear URL", "URL bloqueada correctamente");

                  // Reload the current tab
                  chrome.tabs.reload(currentTab.id, { bypassCache: true }, () => {
                     if (chrome.runtime.lastError) {
                        console.error('Error al recargar la pestaña:', chrome.runtime.lastError);
                     } else {
                        console.log(`La pestaña ${currentTab.id} se recargó correctamente.`);
                     }
                  });
               }
            });
         }
      });
   });
}
// Función para pedir la contraseña al usuario
function askForPassword(callback) {
   chrome.storage.local.get(['password'], (result) => {
      if (chrome.runtime.lastError) {
         showError('Error al acceder al almacenamiento de contraseñas');
         return;
      }

      const storedPassword = result.password;

      if (!storedPassword) {
         showError('No hay contraseña configurada.');
         return;
      }

      const userPassword = prompt('Ingrese la contraseña para desbloquear la URL:');
      if (userPassword === storedPassword) {
         callback(); // Si la contraseña es correcta, ejecuta la función de desbloqueo
      } else {
         alert('Contraseña incorrecta.');
      }
   });
}

// Función para actualizar el botón y mostrar mensajes
function updateButtonAndMessage(buttonText, messageText) {
   btn.textContent = buttonText; // Cambia el texto del botón
   mensaje.textContent = messageText; // Muestra un mensaje en pantalla
}

// Función para mostrar errores
function showError(errorMessage) {
   console.error(errorMessage);
   mensaje.textContent = errorMessage;
}

// Leer y mostrar todos los datos de la lista negra
function LeerStore() {
   chrome.storage.local.get(['blacklist'], (result) => {
      if (chrome.runtime.lastError) {
         console.error('Error al acceder al almacenamiento:', chrome.runtime.lastError);
      } else {
         const blacklist = result.blacklist || [];
         console.log('Lista negra actual:', blacklist);
      }
   });
}

// Vaciar completamente la lista negra
function VaciarTodosLosDatos() {
   chrome.storage.local.set({ blacklist: [] }, () => {
      if (chrome.runtime.lastError) {
         console.error('Error al vaciar la lista negra:', chrome.runtime.lastError);
      } else {
         console.log('Lista negra vaciada correctamente.');
      }
   });
}

function EnviarDatosAlServidor() {
   chrome.storage.local.get(['blacklist'], (result) => {
      if (chrome.runtime.lastError) {
         console.error('Error al acceder al almacenamiento:', chrome.runtime.lastError);
      } else {
         const blacklist = result.blacklist || [];
         fetch('http://localhost:5000/api/blacklist', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ blacklist })
         })
            .then(response => response.json())
            .then(data => console.log('Respuesta del servidor:', data))
            .catch(error => console.error('Error al enviar los datos:', error));
      }
   });
}
function ExportarBlacklist() {
   chrome.storage.local.get(['blacklist'], (result) => {
      if (chrome.runtime.lastError) {
         console.error('Error al acceder al almacenamiento:', chrome.runtime.lastError);
      } else {
         const blacklist = result.blacklist || [];
         const dataStr = JSON.stringify(blacklist, null, 2);
         const blob = new Blob([dataStr], { type: 'application/json' });
         const url = URL.createObjectURL(blob);

         // Crea un enlace para descargar el archivo JSON
         const a = document.createElement('a');
         a.href = url;
         a.download = 'blacklist.txt';
         a.click();
         URL.revokeObjectURL(url);
      }
   });
}