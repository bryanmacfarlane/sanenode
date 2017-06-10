import appm = require('./app');
import http = require('http');
import * as exp from 'express';

var port = getPort(process.env.API_PORT, 7770);

var _server: http.Server = null;

async function startServer() {
    var app = await appm.create();
    _server = http.createServer(app);
    _server.listen(port, onListening);
}

startServer();

function getPort(val, def) {
    var port = parseInt(val, 10);
    if (isNaN(port) || port <= 0) {
        return def;
    }

    return port;
}

function onListening() {
    var addr = _server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}