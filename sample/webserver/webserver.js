var http = require('http');
var fs = require('fs');
var config = require('./config.json');

fs.writeFile("log.txt", "Server started")

function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

var server = http.createServer(handleRequest);
var port = config.serverPort;
server.listen(port, function(){
    console.log("Server listening on: http://localhost:%s", port);
});
