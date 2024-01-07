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
        //console.log("\n\n Je suis iciiiiiiiiiiiiiiiii \n\n");
        //console.log(results);
        return results;
        //console.log("\n A chaque tour pour chaque question j'affiche le type de question : " + parsedQuestion.typeOfQuestion); 
    }

//avec le chemin du dossier, retourne un tableau des noms des fichiers contenus dans le dossier
function obtenirFichiers(cheminDossier) {
    try {
        const nomsFichiers = fs.readdirSync(cheminDossier);
        return nomsFichiers;
    } catch (erreur) {
        console.error('Erreur lors de la récupération des noms de fichiers :', erreur.message);
        return [];
    }
}

//avec le tableau des noms des fichiers, parcourt chacun des fichiers et mets les questions dans un tableau
function questionsDossiers(cheminDossier){
    let questionsAllFichiers = [];
    const nomsFichiers = obtenirFichiers(cheminDossier);
    nomsFichiers.forEach ((fichier) => {
        const questionOneFichier = importerQuestions(cheminDossier + '/' +fichier);
        questionsAllFichiers = questionsAllFichiers.concat(questionOneFichier);
    });
    return questionsAllFichiers;
}

//à partir d'un tableau de question (test ou issu d'un dossier) retourne un tableau avec le nombre et pourcentage de question pour chaque type
function typeQuestion(Questions){
    let countType = [
        ['Description', 0],
        ['ChoixMultiple',0],
        ['Appariement', 0],
        ['ReponseCourte', 0],
        ['VraiFaux', 0],
        ['ReponseNumerique', 0],
        ['ReponseNumeriqueMultiple', 0],
        ['Composition', 0]
       ];
    Questions.forEach((question) => {
        countType.forEach((type) => {
            if (question.typeOfQuestion === type[0]) {
                type[1]++;
            }
        });
    })
    const repartType = pourcentageType(countType, Questions);
    return repartType;
}

//appelée par la fonction typeQuestion, permet de remplir la colonne pourcentage
function pourcentageType(repartType, Questions){
    repartType.forEach((type) => {
        const pourcentage = (type[1] * 100) / Questions.length;
        type[2] = parseFloat(pourcentage.toFixed(1));
    });
    return repartType;
}

//dernière fonction, permet de comparer un test et un dossier de fichiers de questions à partir de leurs chemins d'accès
function comparerTest(cheminTest, cheminGroupe){
    const testAComparer = importerQuestions(cheminTest); //questions du test
    const groupeAComparer = questionsDossiers(cheminGroupe); //questions du dossier
    const repartTest = typeQuestion(testAComparer); //repartition des questions dans le test
    const repartGroupe = typeQuestion(groupeAComparer); //repartition des questions dans le groupe
    console.log('Voici une comparaison de la répartitions des types de questions dans votre test avec le dossier de test choisi \n');
    repartTest.forEach((type, index) => {
        console.log(`${type[0]} : votre test -> ${type[2]}% // ${repartGroupe[index][2]}% \n`);
    })
}

module.exports = {
    comparerTest,
    importerQuestions
}
