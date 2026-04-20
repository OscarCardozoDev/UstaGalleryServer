const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const collectionsDir = './postman/collections/server-api';
const collectionPath = path.join(collectionsDir, 'collection.json');

// Leer la colección base
let collection = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

// Limpiar items previos para regenerar
collection.item = [];

// Estructura de carpetas
const folders = ['Auth', 'Groups', 'Photos', 'Products', 'Styles', 'User'];

folders.forEach(folder => {
  const folderPath = path.join(collectionsDir, folder);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Carpeta no encontrada: ${folder}`);
    return;
  }

  // Encontrar todos los .request.yaml
  const files = fs.readdirSync(folderPath)
    .filter(f => f.endsWith('.request.yaml'));

  if (files.length === 0) {
    console.log(`⚠️  No hay archivos .request.yaml en ${folder}`);
    return;
  }

  // Crear carpeta en la colección
  const folderItem = {
    name: folder,
    item: []
  };

  files.forEach(file => {
    try {
      const filePath = path.join(folderPath, file);
      const requestYaml = fs.readFileSync(filePath, 'utf8');
      const requestData = yaml.parse(requestYaml);

      const requestName = file.replace('.request.yaml', '');
      
      folderItem.item.push({
        name: requestName,
        request: requestData
      });

      console.log(`✅ ${folder} → ${requestName}`);
    } catch (error) {
      console.error(`❌ Error procesando ${file}: ${error.message}`);
    } 
  });

  collection.item.push(folderItem);
});

// Guardar el collection.json actualizado
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
console.log('\n✅ collection.json actualizado con todos los endpoints\n');