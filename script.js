
const btn = document.getElementById('submitPassword');

btn.addEventListener('click', async () => {
   try {
      const password = await leerJSON();
      alert("La contraseña es: " + password);
   } catch (err) {
      console.error('Error al leer el JSON:', err);
   }
});
async function leerJSON() {
   try {
      const response = await fetch(chrome.runtime.getURL('password.json'));
      if (!response.ok) {
         throw new Error('No se pudo cargar el archivo JSON');
      }
      const data = await response.json();
      return data.password || "No hay contraseña almacenada";
   } catch (err) {
      console.error('Error al cargar el archivo JSON:', err);
      throw err;
   }
}