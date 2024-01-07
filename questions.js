const fs = require('fs');
const {Parser} = require('./parser');
const {Question} = require('./qcm');
const {QCM} = require('./qcm');
const vega = require('vega');
const vegalite = require('vega-lite');
const { type } = require('os');
const { types } = require('util');
var {importerQuestions} = require('./dossier.js');


//importer les questions depuis les fichiers à l'aide du parser
//retourner un tableau de class Question
//fonction utilisée pour l'exemple
function importerQuestions(){
    const parser = new Parser();
    let data = fs.readFileSync('GIFT-examples.gift', 'utf8');
        parser.parse(data);
        let results = parser.parsedQuestions;
        return results;
}
//parcourir le tableau des class Question et afficher l'index et le contenu de chaque question
function afficherAllQuestions(Questions) {
    Questions.forEach((parsedQuestion, index) => {
        console.log(`${index + 1}. ${parsedQuestion.text} \n`);
    });
}

//afficher la question d'index précisé par l'utilisateur
function afficherQuestion(Questions, index) {
    if (index > 0 && index <= Questions.length){
        console.log(`${index}. ${Questions[index-1].text} \n`);
    }else{
        console.log('Index invalide');
        return false;
    }
}
    
//afficher le contenu du test crée par l'utilisateur
function afficherTest(Test){
    if (Test.length != 0){
        console.log('Votre test : \n')
        afficherAllQuestions(Test);
    }else{
        console.log('Aucune question dans votre test');
        return false;
    }
}

//vérifier sir la question concernée est déjà présente dans le test
//ajouter à la table Test la question d'index précisé par l'utilisateur
function selectionnerQuestion(Questions, Test, index){
    if (index > 0 && index <= Questions.length){
        let already = false;
        Test.forEach((parsedQuestion) => {
            if (parsedQuestion === Questions[index-1]) {
                already = true;
            }
        })
        if (already === true){
            console.log(`La question ${index} est déjà dans votre test`);
            return false;
        }else{
            Test.push(Questions[index-1]);
        console.log(`La question ${index} a été ajoutée à votre test`);
        }
    }else{
        console.log('Index invalide');
        return false;
    }
}

//supprimer du test la question d'index précisé par l'utilisateur
//l'index spécifié est l'index dans le test != l'index dans la liste de question
function deselectionnerQuestion(Test, index){
    if (index > 0 && index <= Test.length){
        Test.splice(index-1, 1);
        console.log(`La question ${index} a été supprimée de votre test`);
    }else{
        console.log('Index invalide');
        return false;
    }
}

//établir le profil type d'un test
function profilType(Test){
    let questionTypes = {};
    let nbTotalQuestions = 0;
    Test.forEach((questions) => {
        if (questions.typeOfQuestion in questionTypes){
            questionTypes[questions.typeOfQuestion] += 1; 
        } else {
            questionTypes[questions.typeOfQuestion] = 1;
        }
        nbTotalQuestions += 1;
    });
    for (let [type, nombreType] of Object.entries(questionTypes)) {
        questionTypes[type] = (nombreType*100)/nbTotalQuestions;
        console.log(`\n ${type} : ${questionTypes[type]} %`);
      }
}

//afficher les statistiques d'un test
//enregistre un histogramme avec la répartition des types de question dans le test
function statistiques(Test, testAComparer){
    let data = {"Values" : []};
    let nbTotalQuestions = 0;
    Test.forEach((questions) => {
        TypeRecherche = questions.typeOfQuestion;
        TypeTrouver = false;
        data.Values.forEach((Value) =>{
            if (Value.type == TypeRecherche){
                TypeTrouver = true;
                Value.nbquestions += 1;
            }
        });
        if (TypeTrouver === false){
            data.Values.push({"type" : TypeRecherche, "nbquestions" : 1, "nbquestionstot":0});
        }
        nbTotalQuestions += 1;
    });
    data.Values.forEach((Value)=>{
        Value.nbquestions = (Value.nbquestions * 100) / nbTotalQuestions
    });
    console.log(data);
    let TestsComparer = importerQuestions(testAComparer);
    nbTotalQuestions = 0;
    TestsComparer.forEach((questions) => {
        TypeRecherche = questions.typeOfQuestion;
        TypeTrouver = false;
        data.Values.forEach((Value) =>{
            if (Value.type == TypeRecherche){
                TypeTrouver = true;
                Value.nbquestionstot += 1;
            }
        });
        if (TypeTrouver === false){
            data.Values.push({"type" : TypeRecherche, "nbquestions" : 0, "nbquestionstot": 0});
        }
        nbTotalQuestions += 1;
    });
    data.Values.forEach((Value)=>{
        Value.nbquestionstot = (Value.nbquestionstot * 100) / nbTotalQuestions
    });
    console.log("deuxieme tableau");
    console.log(data);

    //questionsDossiers(testAComparer,data);
    /*let Values = [];
    Test.forEach((parsedQuestion) => {
        Values.push({
            type: parsedQuestion.typeOfQuestion,
            count: 1,
        });
        console.log("ou j'affiche le tableau complet " + JSON.stringify(Values) + " \n\n");
    })*/
    
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title":"Répartition des types de questions dans votre test",
        "data": {
            "values" : data.Values
        },
        "repeat": {"layer": ["nbquestions", "nbquestionstot"]},
        //"columns" : 2,
        "spec" : {
            "mark": "bar",
            "encoding": {
                "x": {"field": "type", "type": "nominal", "title" : "Types de questions"},
                "y": {"field": {"repeat": "layer"}, "type": "quantitative", "title" : "Pourcentage de chaque type de questions"},
                //"size": {"value": 20},
                //"color": {"value": "#8C466F "},
                "color": {"datum": {"repeat": "layer"}, "title": "Tests à comparer"},
                "xOffset": {"datum": {"repeat": "layer"}}
            }
        },
        "config": {
            "mark": {"invalid": null}
          }
    };

    let specCompiled = vegalite.compile(spec).spec;
    const runtime = vega.parse(specCompiled);
    const view = new vega.View(runtime).renderer('svg').run();
    mySvg = view.toSVG();
        mySvg.then(svg => {
            fs.writeFileSync('histogram.svg', svg);
            view.finalize();
            console.log('L\'histogramme a été enregistré avec succès dans le fichier "histogram.svg". \n');
        })
        .catch(error => console.error(error));
}

// Exportez les fonctions pour pouvoir les utiliser dans d'autres fichiers
module.exports = {
    importerQuestions,
    afficherAllQuestions,
    afficherQuestion,
    afficherTest,
    selectionnerQuestion,
    deselectionnerQuestion,
    statistiques,
    profilType
};