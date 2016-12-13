'use strict';

var http = require('http');

var getRequest = function (options, completed, error) {
    var request = http.request(options, function (response) {
        response.setEncoding('utf-8');

        var responseString = '';

        response.on('data', function (data) {
            responseString += data;
        });

        response.on('end', function () {
            completed(responseString && JSON.parse(responseString), response.statusCode);
        });
    });

    request.on('error', error);

    return request;
};

var get = function (host, port, path, headers, completed, error) {
    if (!headers.accept) {
        headers.accept = 'application/json';
    }

    var options = {
        host: host,
        port: port,
        path: path,
        method: 'GET',
        headers: headers
    };

    var request = getRequest(options, completed, error);

    request.end();
};

var post = function (host, port, path, headers, data, completed, error) {
    if (!headers['accept']) headers['accept'] = 'application/json';
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = data.length;
    var options = {
        host: host,
        port: port,
        path: path,
        method: 'POST',
        headers: headers
    };

    var request = getRequest(options, completed, error);

    request.write(data);
    request.end();
};

exports.get = get;
exports.post = post;