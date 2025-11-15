const fs = require('fs');
const path = require('path');

const esmDir = path.join(__dirname, '..', 'dist', 'esm');
const distDir = path.join(__dirname, '..', 'dist');

// Function to recursively get all .js files
function getAllJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Convert .js extensions in imports to .mjs
function convertImports(content) {
  return content
    .replace(/from ['"](\..+)\.js['"]/g, "from '$1.mjs'")
    .replace(/require\(['"](\..+)\.js['"]\)/g, "require('$1.mjs')");
}

// Get all .js files in esm directory
const jsFiles = getAllJsFiles(esmDir);

// Convert each file
jsFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = convertImports(content);
  
  const newPath = file.replace(/\.js$/, '.mjs');
  fs.writeFileSync(newPath, content);
  fs.unlinkSync(file); // Remove original .js file
});

// Move main index.mjs to dist root
const mainFile = path.join(esmDir, 'index.mjs');
if (fs.existsSync(mainFile)) {
  fs.copyFileSync(mainFile, path.join(distDir, 'index.mjs'));
}

console.log('ESM build completed');
