const fs = require('fs');
const {Parser} = require('./parser');
const vegalite = require('vega-lite');
const path = require('path');

//fonction avec en argument le chemin du fichier à importer
//meme fonction que dans question.js
function importerQuestions(chemin){
    const parser = new Parser();
    let data = fs.readFileSync(chemin, 'utf8');
        parser.parse(data);
        let results = parser.parsedQuestions;
        return results;
    }

module.exports = {
    //comparerTest,
    importerQuestions
}
