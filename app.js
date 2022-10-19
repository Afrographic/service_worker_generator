const fs = require("fs");
const projectPath = 'D:/laragon/www/Isis Server/public';
let cacheFiles = [];


function listFiles(path) {
    let files = fs.readdirSync(path);
    files.forEach(file => {
        if (isDirectory(`${path}/${file}`)) {
            listFiles(`${path}/${file}`);
            return;
        }
        cacheFiles.unshift(`${path}/${file}`);
    });
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function extractFilesForServiceWorker() {
    for (let file of cacheFiles) {
        let fileIndex = cacheFiles.indexOf(file);
        file = removeMotherPath(file);
        cacheFiles[fileIndex] = file;
    }
}

function removeMotherPath(file){
    return file.substring(projectPath.length, file.length);
}

listFiles(projectPath);
extractFilesForServiceWorker();
console.log(cacheFiles);