const fs = require('fs');
function leerJSON() {
   fs.readFile('blocksite/urls.json', 'utf8', (err, data) => {
      if (err) {
         console.error(err);
         return;
      }

      // Convierte la cadena JSON a un objeto de JavaScript
      const jsonData = JSON.parse(data);

      // Accede a la propiedad "urls"
      console.log(jsonData.urls); // Esto devuelve un array con las URLs
   });

}


function NuevaUrl() {
   fs.readFile('blocksite/urls.json', 'utf8', (err, data) => {
      if (err) {
         console.error(err);
         return;
      }

      // Convierte la cadena JSON a un objeto de JavaScript
      const jsonData = JSON.parse(data);

      // Ingresas solo el nombre del sitio
      const siteName = "twitter";  // Aquí puedes ingresar solo el nombre del sitio

      // Construir la URL automáticamente
      const newUrl = `https://${siteName}.com/`;

      // Agregar la nueva URL al array de URLs
      jsonData.urls.push(newUrl);

      // Escribir los cambios de vuelta al archivo JSON
      fs.writeFile('blocksite/urls.json', JSON.stringify(jsonData, null, 2), (err) => {
         if (err) {
            console.error("Error al guardar el archivo JSON:", err);
         } else {
            console.log("Archivo JSON actualizado correctamente.");
         }
      });

      // Mostrar el resultado con la nueva URL añadida
      console.log(jsonData.urls);  // Muestra todas las URLs con la nueva añadida
   });
}

NuevaUrl();
