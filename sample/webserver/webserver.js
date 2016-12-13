'use strict';

var http = require('http');
var fs = require('fs');
var methods = require('./http-methods');

fs.writeFile("log.txt", "Server started")

var config = require('./config.json');

var verifyStatusCode = function (name, statusCode, error) {
    if (statusCode < 200 || statusCode > 299) {
        error({ name: 'loginError', message: name + ' failed, server returned status code ' + statusCode });
        return false;
    }
    return true;
};

var getAllUsers = function (ended, error) {
    var completed = function (responseObject, statusCode) {
        if (!verifyStatusCode('index', statusCode, error)) { return; }
        ended(responseObject);
    };
    methods.get(config.appServerAddress, config.appServerPort, '/users', { }, completed, error);
};

var addUser = function (name, age, ended, error) {
    var completed = function (responseObject, statusCode) {
        if (!verifyStatusCode('addUser', statusCode, error)) { return; }
        ended(responseObject);
    };
    var data = {"age": age, "id": 3, "name": name};
    methods.post(config.appServerAddress, config.appServerPort, '/users', { }, JSON.stringify(data), completed, error);
};

var templatePage = '<!DOCTYPE html>\
<html>\
<body>\
\
<form action=\"adduser\">\
  <H3>Add new user</H3>\
  Name:<br>\
  <input type=\"text\" name=\"name\" value=\"\">\
  <br>\
  Last Age:<br>\
  <input type=\"text\" name=\"age\" value=\"\">\
  <br><br>\
  <input type=\"submit\" value=\"Submit\">\
</form> \
\
<p>\
<H3>Current users</H3>\
%USERS%\
</p>\
\
</body>\
</html>'

var params=function(req){
  let q=req.url.split('?'),result={};
  if(q.length>=2){
      q[1].split('&').forEach((item)=>{
           try {
             result[item.split('=')[0]]=item.split('=')[1];
           } catch (e) {
             result[item.split('=')[0]]='';
           }
      })
  }
  return result;
}

function handleRequest(request, response){
    var parameters=params(request);
    var dynamic = ''
    var updateUsers = function(result){
        getAllUsers(function(users){
        users.forEach(function(value){
            dynamic+='Id: '+value['id'];
            dynamic+='\tName: '+value['name'];
            dynamic+='\tAge: '+value['age']+'</br>\n';
        });
        var page = templatePage.replace('%USERS%', dynamic)
        response.writeHead(200, {
          'Cache-Control': 'no-cache'
        });
        response.end(page);
    }, function(e){
        console.log('Get users failed')
       });        
    }
        
    if(request.url.startsWith('/adduser')){request
        console.log('adding new user: '+ parameters.name);
        addUser(parameters.name, parameters.age, updateUsers, function(e){console.log('Get users failed')});
        dynamic+='<p><b>added new user: '+ parameters.name+"</b></p>\n"
    }
    else
    {
        updateUsers()       
   }
}

var server = http.createServer(handleRequest);
var listeningPort = config.listeningPort;
server.listen(listeningPort, function(){
    console.log("Server listening on: http://localhost:%s", listeningPort);
});
