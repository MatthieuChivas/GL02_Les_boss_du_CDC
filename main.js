
var accountConnexion = require('./accountConnexion.js');
var readlineSync = require('readline-sync');
var { Parser } = require('./parser.js');
var fs = require('fs');
var { QCM } = require('./qcm.js');
var colors = require('colors');
var infoToVcard = require('./infoToVcard.js');
var { comparerTest } = require('./dossier.js');
var { statistiques } = require('./questions.js');
const questionAsync = require('./interactionUtilisateur.js');



class Menu{
    test = new QCM([]);
    importQuestions = new QCM([]);
    path = "";
    whoIsUser;
    Menu(whoIsUser){
        this.whoIsUser=whoIsUser;
    }

    //l'import ce fait au début une fois et puis on charge une fois le système... (ATTENTION importQuestions ne contiendra pas forcément une question ex : déselection)
    async menuImportDebut(){
        let choix = await questionAsync("1 - Parcourir la banque de question\n2 - Quitter \n3 - Exporter VCARD\nQue souhaitez-vous faire ?");
        switch(choix){
            case "1":
                let results = await this.parcourirBanqueQuestion();
                this.importQuestions = results.f;
                this.path = results.d;
                break;
            case "2":
                return;
            case "3":
                infoToVcard(this.whoIsUser);
                return;
        }
    }
        
    async menuEnseignant(){
        console.clear();
        let choix;
        do{
            choix = await questionAsync("1 - Parcourir la banque de question\n2 - Selectionner les questions du test\n3 - Afficher toutes les questions selectionnées\n4 - Qualite du test\n5 - Simuler Test\n6 - Exporter Test\n7 - Exporter VCARD\n8 - Quitter\nSelection : ");
            switch(choix){
                case "1":
                    let results = await this.parcourirBanqueQuestion();
                    this.importQuestions = results.f;
                    this.path = results.d;
                    break;
                case "2":
                    await this.menuSelectionQuestion();
                    break;
                case "3":
                    await this.test.afficherToutesQuestions();
                    break;
                case "4":
                    await this.test.verifierQualite();
                    break;
                case "5":
                    await this.test.exporterFichier();
                    console.log("Le fichier a été exporté avec succès.".green);
                    break;
                case "6":
                    await infoToVcard(this.whoIsUser);
                    console.log("Le fichier a été exporté avec succès.".green);
                    break;
                case "7":
                    statistiques(this.test.questions);
                    console.log("Le fichier a été exporté avec succès.".green);
                    break;
                case "8":
                    console.log("exit...");
                    break;
                default :
                    console.log("Rentrer chiffre valable");
            }
        }while(choix!="8");
    }

    async menuClassiqueSYREM(){
        console.clear();
        let choix;
        do{
            choix = await questionAsync("1 - Parcourir la banque de question\n2 - Selectionner les questions du test\n3 - Afficher toutes les questions selectionnées\n4 - Qualite du test\n5 - Simuler Test\n6 - Exporter Test\n7 - Exporter VCARD\n8 - Generer un profil moyen d'un examen\n9 - Comparer type de question\n10 - Quitter\nSelection : ");
            switch(choix){
                case "1":
                    let results = await this.parcourirBanqueQuestion();
                    this.importQuestions = results.f;
                    this.path = results.d;
                    break;
                case "2":
                    await this.menuSelectionQuestion();
                    break;
                case "3":
                    await this.test.afficherToutesQuestions();
                    break;
                case "4":
                    await this.test.verifierQualite();
                    break;
                case "5":
                    await this.test.exporterFichier();
                    console.log("Le fichier a été exporté avec succès.".green);
                    break;
                case "6":
                    await infoToVcard(this.whoIsUser);
                    console.log("Le fichier a été exporté avec succès.".green);
                    break;
                case "7":
                    statistiques(this.test.questions);
                    console.log("Le fichier a été exporté avec succès.".green);
                case "8":
                    let folderPath = this.path.replace(/[^\/]{1,}$/gm, "")
                    comparerTest(this.path, folderPath);
                    break;
                case "9":
                    //Cette fonction n'a pas été codé? 
                    break;
                case "10":
                    console.log("exit...");
                default :
                    console.log("Rentrer chiffre valable");
            }
        }while(choix!="10");
    }
    
    async menuSelectionQuestion(){
        let userInput;
        let number;
        let choix1;
        do{
            choix1 = await questionAsync("1 - Selection\n2 - Deselection\n3 - Terminer la selection\nSelectionner : ");
            let longueurQuestion = this.importQuestions.questions.length;
            switch(choix1){
                case "1":
                    userInput = await questionAsync(`Entrer un entier entre 0 et ${longueurQuestion}\nSelection : `);
                    number = parseInt(userInput);
                    if (!isNaN(userInput) && userInput >= 0 && userInput < this.importQuestions.questions.length - 1) {
                        this.questionSelection(this.importQuestions, this.test, number, "selection");
    
                    } else {
                        console.log('L\'index entré n\'appartient pas à la liste d\'instances de la classe question.'.red);
                    }
                    break;
                case "2":
                    userInput = await questionAsync(`Entrer un entier entre 0 et ${longueurQuestion}`);
                    number = parseInt(userInput);
                    if (!isNaN(userInput) && userInput >= 0 && userInput < this.importQuestions.questions.length) {
                        this.questionSelection(this.importQuestions, this.test, number, "deselection");
    
                    } else {
                        console.log('L\'index entré n\'appartient pas à la liste d\'instances de la classe question.'.red);
                    }
                    break;
            }
        }while(choix1!="3");
    }   

    //fonctionnalité pour parcourir la banque de question et crée le QCM
    async parcourirBanqueQuestion() {
        let importQuestions;
        console.clear();
        let path = "./questions_data";
        const getDirectories = fs.readdirSync(__dirname + '/questions_data', { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
        console.log("Veuillez choisir un dossier :");
        getDirectories.forEach(element => {
            console.log(element);
        });
        let choix = await questionAsync("Choix : ");
        path += "/" + choix;
        const getFile = fs.readdirSync(path);
        console.log("Veuillez choisir un fichier :");
        getFile.forEach(element => {
            console.log(element);
        });
        choix = await questionAsync("Choix : ");
        path += "/" + choix;
        let importRaw = fs.readFileSync(path, 'utf8');
        let parser = new Parser();
        parser.parse(importRaw);
        importQuestions = new QCM(parser.parsedQuestions);
        console.log("Voici les questions importées :");
        importQuestions.afficherToutesQuestions();
        return { f: importQuestions, d: path };
    }

    //fonctionnalité pour sélectionner ou déselectionner les questions
    questionSelection(parsedQuestions, test, numeroQuestion, action) {
        if (action === 'selection') {
            // Ajouter la question à la liste des questions sélectionnées
            // Vous pourriez avoir une propriété pour stocker les questions sélectionnées dans votre classe
            test.questions.push(parsedQuestions.questions[numeroQuestion - 0]);
            console.log(`Question ${numeroQuestion} sélectionnée.`.green);
            console.log(`${parsedQuestions.questions[numeroQuestion].text} (${parsedQuestions.questions[numeroQuestion].typeOfQuestion})`.green);
        } else if (action === 'deselection') {
            // Retirer la question de la liste des questions sélectionnées
            // Vous pourriez avoir une propriété pour stocker les questions sélectionnées dans votre classe
            test.questions = test.questions.filter((question) => question !== parsedQuestions.questions[numeroQuestion]);
            console.log(`Question ${numeroQuestion} désélectionnée.`.green);
        } else {
            console.log('Action invalide. Utilisez "selection" ou "deselection".'.red);
        }
    }
}

async function main(){
    //permet de se connecter
    var whoIsUser = await accountConnexion();

    //creer un objet menu pour la gestion utilisateur
    menu = new Menu(whoIsUser);

    //permet de faire l'importation d'une base de donnée
    await menu.menuImportDebut();

    switch(whoIsUser[0]){
        case("Enseignant"):menu.menuEnseignant();break;
        case("SYREM"): menu.menuSYREM();break;
    }   
}

main();