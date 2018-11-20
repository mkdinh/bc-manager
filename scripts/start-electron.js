const http = require('http');
const env = require('../configs/env.constant');
const config = require('../configs/app.config.json');
const { spawn } = require('child_process');

const args = ['start:electron']

const opts = {
    stdio: 'inherit',
    cwd: './',
    shell: true
}

const startTime = new Date();
let req;
let started = false;

if (process.env.NODE_ENV === env.NODE_ENV.PRODUCTION) {
    spawn('yarn', args, opts);
} else {
    connectToClient();    
}

function connectToClient() {
    req = http.request(config.client.dev, res => {
        res.on('data', responseHandler)
    });

    req.on('error', errorHandler)
    req.end();
}

function errorHandler(err) {
    if (!started) {
        started = true
        process.stdout.write('connecting to client .')
    }
    const timeDiff = new Date() - startTime
    if (timeDiff < 30000) {
        process.stdout.write('.');
        setTimeout(connectToClient, 1000)
    } else {
        throw new Error(`cannot connect client after ${timeDiff / 1000} seconds`)
    }
}

function responseHandler(res) {
    spawn('yarn', args, opts);
}