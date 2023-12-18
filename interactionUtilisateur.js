const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { transferableAbortSignal } = require('node:util');
const { Console } = require('node:console');
const rl = readline.createInterface({ input, output });

const questionAsync = (prompt) => {
    return new Promise((resolve) => {
    rl.question(prompt, resolve);
    });     
}

module.exports = questionAsync;