const http = require('http');
const fs = require('fs');
const url = require('url');
const queryString = require('querystring');

const todos = [
    {
        id : Math.random() + '',
        message: "Do homework",
        completed: false
    },
    {
        id: Math.random() + '',
        message: "Take a shower",
        completed: false
    },
    {
        id: Math.random() + '',
        message: "Have a dinner",
        completed: true
    }
];

const server = http.createServer(function(req, res){
    const method = req.method;
    const parsedUrl = url.parse(req.url);
    const parsedQuery = queryString.parse(parsedUrl.query);

    if (method === 'GET') {
        if (req.url.indexOf('/todos') === 0) {
            res.setHeader('Content-Type', 'application/json');
            let response = todos;

            if (parsedQuery.searchtext) {
                response = response.filter(function(obj) {
                    return obj.message.indexOf(parsedQuery.searchtext) >= 0;
                });
            }

            return res.end(JSON.stringify({items: response}));
        } else {
            const path = './public' + req.url;
            const method = req.method;

            fs.readFile(path, function(err, data){
                if (err) {
                    res.statusCode = 404;
                    res.end(err.toString());
                } else {
                    res.end(data);
                }
            });
        }
    }

    if (method === 'POST') {
        if (req.url.indexOf("/todos") === 0) {
            let body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });
            
            req.on('end', function () {
                let obj = JSON.parse(body);
                let message = obj.message;
                obj.id = Math.random() + "";
                obj.completed = false;

                todos[todos.length] = obj;

                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify(obj));
            });
            
            return;
        }
    }

    if (method === 'PUT') {
        if (req.url.indexOf("/todos") === 0) {
            let body = '';

            req.on('data', function (chunk) {
                body += chunk;
            });

            req.on('end', function () {
                let obj = JSON.parse(body);
                for (let i = 0; i < todos.length; i++) {
                    if (obj.id === todos[i].id) {
                        todos[i] = obj;
                        res.setHeader('Content-Type', 'application/json');
                        return res.end(JSON.stringify(obj));
                    }
                }

                res.statusCode = 404;
                return res.end('Error updating the todo');
            });

            return;
        }
    }

    if (method === 'DELETE') {
        if (req.url.indexOf("/todos/") === 0) {
            let deleteId = req.url.substr(7);
            for (let i = 0; i < todos.length; i++) {
                if (todos[i].id === deleteId) {
                    todos.splice(i, 1);
                    res.statusCode = 200;
                    return res.end('TODO removed');
                }
            }

            res.statusCode = 404;
            res.end('Error deleting todo');
        }
    }

}).listen(3001);