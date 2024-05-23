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

const getJoke = (jokes, callback) => {
    fetch('https://api.chucknorris.io/jokes/random')
        .then(response => response.json())
        .then(({ value }) => {
            if (!jokes.includes(value)) {
                writeJSONData('norrisDB', [...jokes, value])
                callback(value);
            } else {
                getJoke(jokes, callback)
            }
        })
}

const server = http.createServer((req, res) => {
    const jokes = readJSONData('norrisDB');
    switch (req.url) {
        case '/favicon.ico':
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end();
            break;
        case '/lista':
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            let fileHtml = '<ul>';
            jokes.forEach(joke => fileHtml += `<li>${joke}</li>`)
            fileHtml += '</ul>';
            res.end(fileHtml);
            break;
        case '/':
            getJoke(jokes, (joke) => {
                res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                res.end(joke)
            });
            break;
    }
});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});