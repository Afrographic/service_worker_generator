const fs = require("fs");
const projectPath = 'C:/Users/Afrographix/OneDrive/Desktop/lol/src';
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
        cacheFiles[fileIndex] = `"${file}"\n`;
    }
}

function removeMotherPath(file) {
    return file.substring(projectPath.length, file.length);
}

listFiles(projectPath);
extractFilesForServiceWorker();

console.log("Current working dir "+__dirname);


let content = `

// Files to cache
const appName = "ankh_cache";
const files = [${cacheFiles}]

async function preCache() {
    const cache = await caches.open(appName);
    return cache.addAll(files);
}

self.addEventListener('install', event => {
    console.log("[SW] installed");
    event.waitUntil(preCache());
})

self.addEventListener('activate', event => {
    console.log("[SW] activated");
})

async function fetchAssets(event) {
    try {
        const response = await fetch(event.request);
        return response;
    } catch (err) {
        const cache = await caches.open(appName);
        return cache.match(event.request);
    }
}

self.addEventListener('fetch', event => {
    console.log("[SW] fetched");
    event.respondWith(fetchAssets(event));
})

`
fs.writeFileSync(`${projectPath}/service_worker.js`, content);