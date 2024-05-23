const http = require("http");
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";
const fs = require("fs");
const path = require("path");

const readJSONData = (fileName) => {
    const filePath = path.join(__dirname, fileName + '.json');
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData)
}

const writeJSONData = (fileName, newData) => {
    const filePath = path.join(__dirname, fileName + '.json');
    const stringToWrite = JSON.stringify(newData);
    fs.writeFileSync(filePath, stringToWrite);
}

const server = http.createServer((req, res) => {
    const jokes = readJSONData('norrisDB');
    if (req.url === '/favicon.ico') {
        res.writeHead(404);
        res.end();
        return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(data => {
            if(!jokes.includes(data.value)){
                writeJSONData('norrisDB', [...jokes, data.value])
            }
        })
        res.end()
});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});