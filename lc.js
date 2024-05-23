const http = require("http");
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";
const fs = require("fs");
const path = require("path");
// const {conteggioVocali, calcolaLunghezzaStringa} = require('./utils.js');

const readJSONData = (nomeFile) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
}

const writeJSONData = (nomeFile, newData) => {
    const filePath = path.join(__dirname, nomeFile + '.json');
    const fileString = JSON.stringify(newData);
    fs.writeFileSync(filePath, fileString);
}

const server = http.createServer( (req, res) => {
    const users = readJSONData('users');
    switch(req.url){
        case '/favicon.ico':
            res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
            res.end();
            break;
        case '/lista': 
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            
            //test con nostro file personale
            let fileHtml = '<ul>';
            users.forEach(u => fileHtml += `<li>${u.name}</li>`);
            fileHtml += '</ul>';
            res.end(fileHtml);
        break;
        case '/':
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            //test con API
            fetch('https://fakestoreapi.com/users')
            .then(response => response.json())
            .then(users => {
                let fileHtml = '<ul>';
                users.forEach( ({name: {firstname, lastname}}) => fileHtml += `<li>${firstname} ${lastname}</li>`);
                fileHtml += '</ul>';
                res.end(fileHtml);
            });
        break;
        default: 
            const name = req.url.slice(1);
            writeJSONData('users', [...users, {name}]);
            res.writeHead(301, { "Location": "/lista" });
            res.end();
        break;
    }
});

server.listen(port, host, () => {
    console.log(`Server avviato su http://${host}:${port}`);
});

	
// fetch(`https://fakestoreapi.com/products/1`)
//   .then(response => response.json())
//   .then(data => console.log(data));

/**
 * 
 */