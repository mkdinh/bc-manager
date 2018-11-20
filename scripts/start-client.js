const { spawn } = require('child_process');

const args = ['serve']

const opts = {
    stdio: 'inherit',
    cwd: './lib/renderer',
    shell: true
}

spawn('yarn', args, opts);