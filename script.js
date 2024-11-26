const btn = document.getElementById('getUrl');
const mensaje = document.querySelector('.Mensaje');

document.addEventListener('DOMContentLoaded', () => {
   initializeButton();
});

// Evento de clic del botón
btn.addEventListener('click', () => {
   handleUrlToggle();
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
      const currentUrl = new URL(tabs[0].url).origin;

      chrome.storage.local.get(['blacklist'], (result) => {
         if (chrome.runtime.lastError) {
            showError('Error al acceder al almacenamiento');
            return;
         }

         const blacklist = result.blacklist || [];
         if (blacklist.includes(currentUrl)) {
            // Si la URL está en la lista negra, pedir confirmación de contraseña antes de desbloquear
            askForPassword(() => {
               // Si la contraseña es correcta, eliminar la URL de la lista negra
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
            // Si la URL no está en la lista negra, agregarla
            blacklist.push(currentUrl);
            chrome.storage.local.set({ blacklist }, () => {
               if (chrome.runtime.lastError) {
                  showError('Error al guardar la URL');
               } else {
                  updateButtonAndMessage("Desbloquear URL", "URL bloqueada correctamente");
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
