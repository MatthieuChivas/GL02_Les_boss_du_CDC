const readlineSync = require('readline-sync'); // Importer le module readlinesync

// Déclaration de classes qu'on utilise dans le projet (les 2 types d'objets qu'on manipule)

// Définir la classe Question à partir de "Sémantique des données"
class Question {

    constructor(title, format, text, answerString) {
        this.title = title;
        this.format = format;
        this.text = text;
        this.answerString = answerString;
    }

    typeofQuestion() {
        if ((this.text.match(/<Answer>/g) || []).length == 0) {
            return "Description";
        }
        if ((this.text.match(/<Answer>/g) || []).length == 1) {
            if ((/{(T|F|TRUE|FALSE)/g.exec(this.answerString[0]) != null)) {
                return "VraiFaux";
            } else if ((/->/g).exec(this.answerString[0]) != null) {
                return "Appariement";
            } else if (this.answerString[0].startsWith("{#")) {
                if (this.answerString[0].includes("=")) {
                    return "ReponseNumeriqueMultiple";
                } else {
                    return "ReponseNumerique";
                }
            } else if (this.answerString[0] == "{}") {
                return "Composition";
            } else if (this.answerString[0].includes("~")) {
                return "ChoixMultiple";
            }
            else {
                return "ReponseCourte";
            }
        } else {
            return "MotManquant";
        }
    }

    goodAnswer() {
        if (this.typeofQuestion() == "Description") {
            return;
        }
        switch (this.typeofQuestion()) {
            case "VraiFaux":
                let answer = this.answerString[0].slice(1, 2);
                if (this.answerString[0].includes("#")) {
                    if (this.answerString[0].match(/\#[^(\#|\~|\}|\=)]{1,}/gm).length == 2) {
                        let retroactionGoodAnswer = this.answerString[0].match(/\#[^(\#|\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        let retroactionBadAnswer;
                        switch (answer) {
                            case "T":
                                retroactionBadAnswer = this.answerString[0].match(/\#[^(\#|\~|\}|\=)]{1,}/gm)[1].replace("#", "").trim();
                                break;
                            case "F":
                                retroactionBadAnswer = this.answerString[0].match(/\#[^(\#|\~|\}|\=)]{1,}/gm)[1].replace("#", "").trim();
                                break;
                            default:
                                break;
                        }
                        this.goodAnswers = { answer: answer, retroaction: this.specialSymbolsRevert(retroactionGoodAnswer), retroactionBadAnswer: this.specialSymbolsRevert(retroactionBadAnswer) };
                    } else {
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        this.goodAnswers = { answer: answer, retroaction: this.specialSymbolsRevert(retroaction) };
                    }
                } else {
                    this.goodAnswers = { answer: answer };
                }
                break;
            case "ReponseCourte":
                let goodAnswerArray = this.answerString[0].slice(1, -1).split("=").slice(1);
                // Cas où il y a une seule bonne réponse
                if (goodAnswerArray.length == 1) {
                    // Cas où il y a une rétroaction
                    if (goodAnswerArray[0].slice(2).includes("#")) {
                        let answer = goodAnswerArray[0].split("#")[0].trim();
                        let retroaction = goodAnswerArray[0].split("#")[1].trim();
                        this.goodAnswers = { answer: this.specialSymbolsRevert(answer), retroaction: this.specialSymbolsRevert(retroaction) };
                    } else {
                        this.goodAnswers = { answer: this.specialSymbolsRevert(goodAnswerArray[0].trim()) };
                    }
                }
                // Cas où il y a plusieurs bonnes réponses
                else {
                    this.goodAnswers = [];
                    goodAnswerArray.map(answer => {
                        if (answer.includes("#")) {
                            let answer = goodAnswerArray[0].split("#")[0].trim();
                            let retroaction = goodAnswerArray[0].split("#")[1].trim();
                            this.goodAnswers.push({ answer: this.specialSymbolsRevert(answer), retroaction: this.specialSymbolsRevert(retroaction) });
                        } else {
                            answer = answer.trim();
                            this.goodAnswers.push({ answer: this.specialSymbolsRevert(answer) });
                        }
                    });
                }
                break;
            case "Appariement":
                let answers = this.answerString[0].slice(1, -1).split("=").slice(1);
                this.goodAnswers = [];
                answers.map(answer => {
                    if (answer.includes("#")) {
                        let seperateArray = answer.split("->");
                        let question = seperateArray[0].trim().replace("=", "");
                        let retroaction = seperateArray[1].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        let expectedMatch = seperateArray[1].replace(/\#[^(\~|\}|\=)]{1,}/gm, "").trim();
                        this.goodAnswers.push({ question: this.specialSymbolsRevert(question), expectedMatch: this.specialSymbolsRevert(expectedMatch), retroaction: this.specialSymbolsRevert(retroaction) });
                    } else {
                        this.goodAnswers.push({ question: this.specialSymbolsRevert(answer.split("->")[0].trim()), expectedMatch: this.specialSymbolsRevert(answer.split("->")[1].trim()) });
                    }
                });
                break;
            case "ChoixMultiple":
                // Cas où il y a plusieurs bonnes réponses ou pourcentage de points
                if (this.answerString[0].includes("~%")) {
                    let answers = this.answerString[0].match(/\%(-|)\d*\%[^(\~||\=|\})]{1,}/gm);
                    this.goodAnswers = [];
                    answers.map(answer => {
                        let weight = parseFloat(answer.match(/\%(-|)\d*\%/gm)[0].replace("%", "").trim()) / 100;
                        let answerString = answer.replace(/\%(-|)\d*\%/gm, "").trim();
                        // Vérifier si il y a une rétroaction
                        if (answerString.includes("#")) {
                            answerString = answerString.split("#")[0].trim();
                            let retroaction = answer.replace(/\%(-|)\d*\%/gm, "").match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                            let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: weight, retroaction: this.specialSymbolsRevert(retroaction) };
                            this.goodAnswers.push(answerObject);
                        } else {
                            let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: weight };
                            this.goodAnswers.push(answerObject);
                        }
                    });
                    // Ajout =[Answer] qui vaut 100% des points
                    if (this.answerString[0].includes("=")) {
                        let answer = this.answerString[0].match(/\=[^(|\~|\}|=)]{1,}/gm);
                        answer.map(answer => {
                            if (answer.includes("#")) {
                                let answerString = answer.replace(/\=[^(\#|\~|\})]{1,}/gm, "").trim();
                                let retroaction = answer.match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                                let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: 1, retroaction: this.specialSymbolsRevert(retroaction) };
                                this.goodAnswers.push(answerObject);
                            } else {
                                let answerString = answer.replace("=", "").trim();
                                let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: 1 };
                                this.goodAnswers.push(answerObject);
                            }
                        });
                    }
                    // Ajout des réponses ~[Answer] qui vaut 0% des points
                    if (/\~[^(|\~|\}|%|=)]{1,}/gm.exec(this.answerString[0]) != null) {
                        let answerFalse = this.answerString[0].match(/\~[^(|\~|\}|%|=)]{1,}/gm);
                        answerFalse.map(answer => {
                            if (answer.includes("#")) {
                                let answerString = answer.replace(/\~[^(\#|\~|\})]{1,}/gm, "").trim();
                                let retroaction = answer.match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                                let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: 0, retroaction: this.specialSymbolsRevert(retroaction) };
                                this.goodAnswers.push(answerObject);
                            } else {
                                let answerString = answer.replace("~", "").trim();
                                let answerObject = { answer: this.specialSymbolsRevert(answerString), weight: 0 };
                                this.goodAnswers.push(answerObject);
                            }
                        });
                    }
                } else {
                    // Cas où il y a une seule bonne réponse
                    if (this.answerString[0].includes("#")) {
                        let answer = this.answerString[0].match(/\=[^(\~|\})]{1,}/gm)[0].replace("=", "").trim();
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        let answerObject = { answer: this.specialSymbolsRevert(answer), retroaction: this.specialSymbolsRevert(retroaction) };
                        this.goodAnswers = answerObject;
                    }
                    let answer = this.answerString[0].match(/\=[^(\#|\~|\})]{1,}/gm)[0].replace("=", "").trim();
                    this.goodAnswers = { answer: this.specialSymbolsRevert(answer) };
                }
                break;
            case "ReponseNumerique":
                // Cas avec borne définie par ":"
                if (this.answerString[0].includes(':')) {
                    let number = parseFloat(this.answerString[0].match(/((\d*(,|\.)\d*)|\d*):/g)[0].replace(":", ""));
                    let marge = parseFloat(this.answerString[0].match(/:((\d*(,|\.)\d*)|\d*)/g)[0].replace(":", ""));
                    if (this.answerString[0].slice(2).includes("#")) {
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        this.goodAnswers = { answer: [number - marge, number + marge], retroaction: retroaction };
                    } else {
                        this.goodAnswers = { answer: [number - marge, number + marge] };
                    }
                    // Cas avec borne définie par ".."
                } else if (this.answerString[0].includes('..')) {
                    let borne = this.answerString[0].match(/\d*(,|\.)\d*\.\.\d(.|,)\d*/g)[0].split("..");
                    borne.forEach((element, index) => {
                        borne[index] = parseFloat(element.replace(",", "."));
                    });
                    if (this.answerString[0].slice(2).includes("#")) {
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        this.goodAnswers = { answer: borne, retroaction: retroaction };
                    } else {
                        this.goodAnswers = { answer: borne };
                    }
                }
                else {
                    // Cas avec rétroaction
                    if (this.answerString[0].slice(2).includes("#")) {
                        let answer = parseFloat(this.answerString[0].match(/\{#((\d*(,|\.)\d*)|\d*)/g)[0].replace("{#", ""));
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        this.goodAnswers = { answer: answer, retroaction: retroaction };
                    } else {
                        let answer = parseFloat(this.answerString[0].match(/\{#((\d*(,|\.)\d*)|\d*)/g)[0].replace("{#", ""));
                        this.goodAnswers = { answer: answer };
                    }
                }
                break;
            case "ReponseNumeriqueMultiple":
                this.goodAnswers = [];
                // Cas où il y a plusieurs bonnes réponses ou pourcentage de points
                if (this.answerString[0].includes("=%")) {
                    let answers = this.answerString[0].match(/\=\%(-|)\d*\%[^(\~||\=|\})]{1,}/gm);
                    this.goodAnswers = [];
                    answers.map(answer => {
                        let weight = parseFloat(answer.match(/\%(-|)\d*\%/gm)[0].replace("%", "").trim()) / 100;
                        let answerString = answer.replace(/=\%(-|)\d*\%/gm, "").trim();
                        if (answerString.includes(":")) {
                            let number = parseFloat(answerString.match(/((\d*(,|\.)\d*)|\d*):/g)[0].replace(":", ""));
                            let marge = parseFloat(answerString.match(/:((\d*(,|\.)\d*)|\d*)/g)[0].replace(":", ""));
                            answerString = [number - marge, number + marge];
                        } else if (answerString.includes("..")) {
                            let borne = this.answerString[0].match(/((\d*(,|\.)\d*)|\d*)\.\.((\d*(,|\.)\d*)|\d*)/g)[0].split("..");
                            borne.forEach((element, index) => {
                                borne[index] = parseFloat(element.replace(",", "."));
                            });
                            answerString = borne;
                        }
                        // Vérifier si il y a une rétroaction
                        if (answer.slice(2).includes("#")) {
                            let retroaction = answer.replace(/\%(-|)\d*\%/gm, "").match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                            let answerObject = { answer: answerString, weight: weight, retroaction: retroaction };
                            this.goodAnswers.push(answerObject);
                        } else {
                            let answerObject = { answer: answerString, weight: weight };
                            this.goodAnswers.push(answerObject);
                        }
                    });
                    // Ajout =[Answer] qui vaut 100% des points
                    if (this.answerString[0].includes("=")) {
                        let answer = this.answerString[0].match(/\=(\d*(,|\.)\d*|\d*)(:|\.\.| )(\d*(,|\.)\d*|\d*)[^=|}]*/gm);
                        answer.map(answer => {
                            let answerString = answer.match(/\=(\d*(,|\.)\d*|\d*)(:|\.\.)(\d*(,|\.)\d*|\d*)[^=]*/gm)[0];
                            if (answerString.includes(":")) {
                                let number = parseFloat(answerString.match(/((\d*(,|\.)\d*)|\d*):/g)[0].replace(":", ""));
                                let marge = parseFloat(this.answerString[0].match(/:((\d*(,|\.)\d*)|\d*)/g)[0].replace(":", ""));
                                answerString = [number - marge, number + marge];
                            } else if (answerString.includes("..")) {
                                let borne = this.answerString[0].match(/\d*(,|\.)\d*\.\.\d(.|,)\d*/g)[0].split("..");
                                borne.forEach((element, index) => {
                                    borne[index] = parseFloat(element.replace(",", "."));
                                });
                                answerString = borne;
                            }
                            if (answer.slice(2).includes("#")) {
                                let retroaction = answer.match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                                let answerObject = { answer: answerString, weight: 1, retroaction: retroaction };
                                this.goodAnswers.push(answerObject);
                            } else {
                                let answerString = answer.replace("=", "").trim();
                                let answerObject = { answer: answerString, weight: 1 };
                                this.goodAnswers.push(answerObject);
                            }
                        });
                    }
                } else {
                    // Cas où il y a une seule bonne réponse
                    if (this.answerString[0].includes("#")) {
                        let answer = this.answerString[0].match(/\=[^(\~|\})]{1,}/gm)[0].replace("=", "").trim();
                        let retroaction = this.answerString[0].match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        let answerObject = { answer: answer, retroaction: retroaction };
                        this.goodAnswers = answerObject;
                    }
                    let answer = this.answerString[0].match(/\=[^(\#|\~|\})]{1,}/gm)[0].replace("=", "").trim();
                    this.goodAnswers = { answer: answer };
                }
                break;
            case "MotManquant":
                this.goodAnswers = [];
                this.answerString.map(answer => {
                    // Si il y a une rétroaction
                    if (answer.includes("#")) {
                        let answerString = answer.match(/\=[^(\~|\}|\#)]{1,}/gm, "")[0].replace("=", "").trim();
                        let retroaction = answer.match(/\#[^(\~|\}|\=)]{1,}/gm)[0].replace("#", "").trim();
                        let answerObject = { answer: this.specialSymbolsRevert(answerString), retroaction: this.specialSymbolsRevert(retroaction) };
                        this.goodAnswers.push(answerObject);
                    } else {
                        let answerString = answer.match(/\=[^(\~|\}|\#)]{1,}/gm, "")[0].replace("=", "").trim();
                        let answerObject = { answer: this.specialSymbolsRevert(answerString) };
                        this.goodAnswers.push(answerObject);
                    }
                });
            default:
                break;
        }
    }

    findPossibleAnswers() {
        let otherAnswers;
        switch (this.typeofQuestion()) {
            case "VraiFaux":
                this.possibleAnswers = ["T", "F"];
                break;
            case "ChoixMultiple":
                this.possibleAnswers = [];
                otherAnswers = this.answerString[0].match(/(\~|\=)[^(\~|\=|\}|\#)]{1,}/gm);
                otherAnswers.map(answer => {
                    answer = answer.replace(/\%(-|)\d*\%/g, "").replace(/\#[^(\~|\}|\=)]{1,}/gm, "");
                    this.possibleAnswers.push(this.specialSymbolsRevert(answer.replace("~", "").replace("=", "").trim()));
                });
                break;
            case "Appariement":
                this.possibleAnswers = [];
                this.goodAnswers.map(answer => {
                    this.possibleAnswers.push(this.specialSymbolsRevert(answer.expectedMatch));
                });
                break;
        }
    }

    getfeedback() {
        for (let i = 0; i < this.answerString.length; i++) {
            if (this.answerString[i].includes("SYMBOL6") == true) {
                this.feedback = this.answerString[i].split("SYMBOL6")[1].replace("}", "").trim();
                let string = "SYMBOL6" + this.feedback;
                this.answerString[0] = this.answerString[0].replace(string, "");
            }
        }
    }

    specialSymbolsRevert(data) {
        let specialSymbols = ["\\~", "\\=", "\\#", "\\{", "\\}", "####"];
        specialSymbols.map((symbol, index) => {
            data = data.replace("SYMBOL" + (index + 1), symbol);
        });
        return data;
    }

    analyseText() {
        this.typeOfQuestion = this.typeofQuestion();
        this.getfeedback();
        this.goodAnswer();
        if(this.answerString[0] != undefined){
            this.specialSymbolsRevert(this.answerString[0])
        }
        this.findPossibleAnswers();
        this.specialSymbolsRevert(this.text);
    }
}



// Définition de la classe QCM à partir de "Sémantique des données"
class QCM {
    questions = [];
    constructor(questions) {
        this.questions = questions;
    }

    afficherQuestion(question, index) {
        let stringToDisplay = "------ Question " + index+ " : " + question.title + "------";
        stringToDisplay += "\nType de question : " + question.typeOfQuestion;
        stringToDisplay += "\nTexte : " + question.text;
        question.possibleAnswers != undefined ? stringToDisplay += "\nRéponses possibles : " + question.possibleAnswers : "";
         stringToDisplay += "\n";
        console.log(stringToDisplay);
    }

    afficherToutesQuestions() {
        this.questions.map((question, index) => {
            this.afficherQuestion(question, index);
        })
    }

    verifierQualite() {
        if (this.questions.length < 15) {
            console.log("Le QCM ne contient pas assez de questions (" + this.questions.length + " trouvées)");
            return false;
        } else if (this.questions.length > 20) {
            console.log("Le QCM contient trop de questions (" + this.questions.length + " trouvées)");
            return false;
        } else {
            this.questions.map((question) => {
                for (let i = 0; i < question.answerString.length; i++) {
                    if (question.titre == this.questions[i].titre) {
                        console.log("Le QCM contient 2 fois la même question (" + question.title + ")");
                        return false;
                    }
                }
            });
        }
        return true;
    }

    exporterFichier() {
        // Vérifie si le nombre de questions est égal à zéro
        if (this.questions.length === 0) {
        console.log("Le questionnaire est vide. Impossible d'exporter.");
        return; // Sort de la fonction si le questionnaire est vide
        }
        let fs = require('fs');
        let stringToWrite = "";
        this.questions.map((question) => {
            stringToWrite += "::" + question.title + "::";
            question.format != "moodle" ? stringToWrite += "[" + question.format + "]" : "";
            if (question.answerString.length > 1) {
                // Cas où c'est un texte à trous
                let texte = question.text.split("<Answer>");
                for (let i = 0; i < question.answerString.length; i++) {
                    stringToWrite += texte[i] + " " + answerString[i] + " ";
                }
                stringToWrite += texte[question.answerString.length] + "\n";
            } else {
                stringToWrite += question.text.replace(/<Answer>(.|)$/gm, "");
                stringToWrite += question.answerString[0] + "\n";
            }
            stringToWrite += "\n";
        });
        fs.writeFile("export.gift", stringToWrite, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    passerTest() {
        let nbBonneRep = 0;
        let erreur = 0;
        let answer;
        let answerArray;
        this.questions.map((question) => {
            console.clear();
            this.afficherQuestion(question);
            switch (question.typeOfQuestion) {
                case "VraiFaux":
                    answer = readlineSync.question("Vrai ou Faux (T/F) :");
                    if (answer == question.goodAnswers.answer) {
                        if (question.hasOwnProperty("retroactionGoodAnswer")) {
                            console.log("Bonne réponse : " + question.retroactionBadAnswer);
                        } else if (question.hasOwnProperty("retroaction")) {
                            console.log("Bonne réponse : " + question.retroaction);
                        }
                        else {
                            console.log("Bonne réponse!");
                        }
                        nbBonneRep++;
                    } else {
                        if (question.hasOwnProperty("retroactionBadAnswer")) {
                            console.log("Bonne réponse : " + question.retroactionBadAnswer);
                        } else {
                            console.log("Bonne réponse!");
                        }
                        erreur++;
                    }
                    break;
                case "Appariement":
                    question.goodAnswers.map(appariement => {
                        let question = appariement.question;
                        let expectedMatch = appariement.expectedMatch;
                        let answer = readlineSync.question(question + " : ");
                        if (answer == expectedMatch) {
                            if (appariement.hasOwnProperty("retroaction")) {
                                console.log("Bonne réponse : " + appariement.retroaction);
                            }
                            else {
                                console.log("Bonne réponse!");
                            }
                            nbBonneRep++;
                        } else {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    });
                    break;
                case "MotManquant":
                    question.goodAnswers.map(answer => {
                        let expectedAnswer = answer.answer;
                        answer = readlineSync.question("Réponse : ");
                        if (answer == expectedAnswer) {
                            if (answer.hasOwnProperty("retroaction")) {
                                console.log("Bonne réponse : " + answer.retroaction);
                            }
                            else {
                                console.log("Bonne réponse!");
                            }
                            nbBonneRep++;
                        } else {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    });
                    break;
                case "Composition":
                    console.log("Il n'y a pas de bonne réponse pour ce type de question, elle doit être vérifiée manuellement");
                    break;
                case "ReponseNumerique":
                    answer = readlineSync.question("Réponse : ");
                    // Vérifier si la réponse est dans une marge
                    if (question.goodAnswers.answer.constructor === Array) {
                        if (answer >= question.goodAnswers.answer[0] && answer <= question.goodAnswers.answer[1]) {
                            if (question.hasOwnProperty("retroaction")) {
                                console.log("Bonne réponse : " + question.retroaction);
                            }
                            else {
                                console.log("Bonne réponse!");
                            }
                            nbBonneRep++;
                        } else {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    } else {
                        if (answer == question.goodAnswers.answer) {
                            if (question.hasOwnProperty("retroaction")) {
                                console.log("Bonne réponse : " + question.retroaction);
                            }
                            else {
                                console.log("Bonne réponse!");
                            }
                            nbBonneRep++;
                        } else {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    }
                    break;
                case "ReponseNumeriqueMultiple":
                    answer = readlineSync.question("Réponse : ");
                    answerArray = question.goodAnswers;
                    for (let i = 0; i < answerArray.length; i++) {
                        if (answerArray[i].answer.constructor === Array) {
                            if (answer >= answerArray[i][0] && answer <= answerArray[i][1]) {
                                if (!(answerArray[i].hasOwnProperty("weight"))) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Bonne réponse : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Bonne réponse!");
                                    }
                                    nbBonneRep++;
                                    break;
                                } else
                                    if (answerArray[i].weight == 1) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Bonne réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Bonne réponse!");
                                        }
                                        nbBonneRep++;
                                        break;
                                    } else if (answerArray[i].weight > 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Réponse partiellement juste : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Réponse partiellement juste!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    } else if (answerArray[i].weight == 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        erreur++;
                                        break;
                                    } else {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        } else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    }
                            }
                        } else {
                            if (answer == answerArray[i].answer) {
                                if (!(answerArray[i].hasOwnProperty("weight"))) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Bonne réponse : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Bonne réponse!");
                                    }
                                    nbBonneRep++;
                                    break;
                                } else
                                    if (answerArray[i].weight == 1) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Bonne réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Bonne réponse!");
                                        }
                                        nbBonneRep++;
                                        break;
                                    } else if (answerArray[i].weight > 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Réponse partiellement juste : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Réponse partiellement juste!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    } else if (answerArray[i].weight == 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        erreur++;
                                        break;
                                    } else {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        } else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    }
                            }
                        }
                        if (i == answerArray.length - 1) {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    }
                    break;
                case "ReponseCourte":
                    answer = readlineSync.question("Réponse : ");
                    answerArray = question.goodAnswers;
                    for (let i = 0; i < answerArray.length; i++) {
                        if (answer == answerArray[i].answer) {
                            if (!(answerArray[i].hasOwnProperty("weight"))) {
                                if (answerArray[i].hasOwnProperty("retroaction")) {
                                    console.log("Bonne réponse : " + answerArray[i].retroaction);
                                }
                                else {
                                    console.log("Bonne réponse!");
                                }
                                nbBonneRep++;
                                break;
                            } else
                                if (answerArray[i].weight == 1) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Bonne réponse : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Bonne réponse!");
                                    }
                                    nbBonneRep++;
                                    break;
                                } else if (answerArray[i].weight > 0) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Réponse partiellement juste : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Réponse partiellement juste!");
                                    }
                                    nbBonneRep += answerArray[i].weight;
                                    erreur++;
                                    break;
                                } else if (answerArray[i].weight == 0) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Mauvaise réponse!");
                                    }
                                    erreur++;
                                    break;
                                } else {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                    } else {
                                        console.log("Mauvaise réponse!");
                                    }
                                    nbBonneRep += answerArray[i].weight;
                                    erreur++;
                                    break;
                                }
                        }
                        if (i == answerArray.length - 1) {
                            console.log("Mauvaise réponse");
                            erreur++;
                        }
                    }
                    break;
                case "ChoixMultiple":
                    answer = readlineSync.question("Réponse : ");
                    answerArray = question.goodAnswers;
                    if (answerArray.constructor === Array) {
                        for (let i = 0; i < answerArray.length; i++) {
                            if (answer == answerArray[i].answer) {
                                if (!(answerArray[i].hasOwnProperty("weight"))) {
                                    if (answerArray[i].hasOwnProperty("retroaction")) {
                                        console.log("Bonne réponse : " + answerArray[i].retroaction);
                                    }
                                    else {
                                        console.log("Bonne réponse!");
                                    }
                                    nbBonneRep++;
                                    break;
                                } else
                                    if (answerArray[i].weight == 1) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Bonne réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Bonne réponse!");
                                        }
                                        nbBonneRep++;
                                        break;
                                    } else if (answerArray[i].weight > 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Réponse partiellement juste : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Réponse partiellement juste!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    } else if (answerArray[i].weight == 0) {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        }
                                        else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        erreur++;
                                        break;
                                    } else {
                                        if (answerArray[i].hasOwnProperty("retroaction")) {
                                            console.log("Mauvaise réponse : " + answerArray[i].retroaction);
                                        } else {
                                            console.log("Mauvaise réponse!");
                                        }
                                        nbBonneRep += answerArray[i].weight;
                                        erreur++;
                                        break;
                                    }
                            }
                            if (i == answerArray.length - 1) {
                                console.log("Mauvaise réponse");
                                erreur++;
                            }
                        }
                    } else {
                        if (question.goodAnswers.answer == answer) {
                            if (question.goodAnswer.hasOwnProperty("retroaction")) {
                                console.log("Bonne réponse : " + question.goodAnswer.retroaction);
                            } else {
                                console.log("Bonne réponse!");
                            }
                            nbBonneRep++;
                            break;
                        } else {
                            if (question.goodAnswer.hasOwnProperty("retroaction")) {
                                console.log("Mauvaise réponse : " + question.goodAnswer.retroaction);
                            } else {
                                console.log("Mauvaise réponse!");
                            }
                            erreur++;
                            break;
                        }
                    }
                    break;
            }
            if (question.hasOwnProperty("feedback")) {
                console.log("Feedback : " + question.feedback);
            }
            console.log("--------------------------------------------------\nPasser à la question suivante ? (Appuyer sur entrée)");
            readlineSync.question("");
        });
        console.log("Nombre de bonnes réponses : " + nbBonneRep + "/" + (nbBonneRep + erreur));
    }
}

module.exports = { Question, QCM };