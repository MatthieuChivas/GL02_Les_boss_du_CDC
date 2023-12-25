//---------------------------------------------------------------------------
//Vient proposer à l'utilisateur de se Login ou de se Register
//Si utilisateur est bien login : isIdentified = true, enteredID = 'Nom de l'utilisateur'
//
//parametres entrée : void
//parametres sortie : whoIsUser[0] = type d'utilisateur entre SRYEM et Enseignant
// ---------------- : whoIsUser[1] = nom de l'utilisateur
//---------------------------------------------------------------------------

const questionAsync = require('./interactionUtilisateur.js');
const fs = require('node:fs');

const accountConnexion = async () => {
    function connexionWindow() {
        console.log(' -------------------------------------------------------------------------------------------------');
        console.log('|Welcome to the account connexion Window.                                                         |');
        console.log('|What do you want to do ?                                                                         |');
        console.log('|                  [1] Log-in                                 [2] Register                        |');
        console.log(' -------------------------------------------------------------------------------------------------');
    }
    let whoIsUser = ['', ''];
    let isIdentified = false;
    let enteredID = '';

    connexionWindow();
    var choix = await questionAsync("Choix : ");
    switch (choix) {
        case 1: await login(); break;
    }
    //Log-in
    if (choix == 1) {
        var choixTypeUser = await questionAsync("Qui etes vous ?\n[1] Enseignant      [2] SRYEM \n");
        //Si user est un enseignant
        if (choixTypeUser == 1) {
            //On lit d'abord le fichier avec les mots de passe / usernames
            const allUserLoginInfos = fs.readFileSync('./loginFile/userLogins.txt', { encoding: 'utf8', flag: 'r' });
            console.log(allUserLoginInfos);
            //On transforme le string obtenu en tableau 
            const tab_allUserLoginInfos = allUserLoginInfos.split("\r\n");

            console.log(tab_allUserLoginInfos);
            while (isIdentified == false) {
                //On demande maintenant à l'utilisateur son login et mot de passe
                enteredID = await questionAsync("Entrez votre nom d'utilisateur : ");
                var enteredPASSWORD = await questionAsync("Entrez votre mot de passe : ");
                for (let i = 0; i < tab_allUserLoginInfos.length; i++) {
                    if (tab_allUserLoginInfos[i] == 'Username:' + enteredID + '-Password:' + enteredPASSWORD) {
                        isIdentified = true;
                        break;
                    }

                }
                if (isIdentified == true) {
                    console.log('Bonjour ' + enteredID + '. Vous êtes bien connecté.');
                } else {
                    console.log('Utilisateur ou mot de passe erroné. Veuillez recommencer.');
                }
            }


            whoIsUser[0] = 'Enseignant';
            whoIsUser[1] = enteredID;
            return (whoIsUser);
        } //Si user est un admin
        else if (choixTypeUser == 2) {
            //On lit d'abord le fichier avec les mots de passe / usernames
            const allUserLoginInfos = fs.readFileSync('./loginFile/adminLogins.txt', { encoding: 'utf8', flag: 'r' });
            //On transforme le string obtenu en tableau 
            const tab_allUserLoginInfos = allUserLoginInfos.split("\r\n");
            console.log(tab_allUserLoginInfos);
            while (isIdentified == false) {
                //On demande maintenant à l'utilisateur son login et mot de passe
                enteredID = await questionAsync("Entrez votre nom d'utilisateur : ");
                var enteredPASSWORD = await questionAsync("Entrez votre mot de passe : ");

                for (let i = 0; i < tab_allUserLoginInfos.length; i++) {
                    if (tab_allUserLoginInfos[i] == 'Username:' + enteredID + '-Password:' + enteredPASSWORD) {
                        isIdentified = true;
                        break;
                    }
                }
                if (isIdentified == true) {
                    console.log('Bonjour ' + enteredID + '. Vous êtes bien connecté.');
                } else {
                    console.log('Utilisateur ou mot de passe erroné. Veuillez recommencer.');
                }
            }
            whoIsUser[0] = 'SRYEM';
            whoIsUser[1] = enteredID;
            return (whoIsUser);
        }
        //Register
    } else if (choix == 2) {
        var userName = await questionAsync("Entrez votre nom d'utilisateur : ");
        //On va s'assurer que l'utilisateur rentre le bon mot de passe en le demandant 2 fois
        var samePassword = false;
        while (samePassword == false) {
            var password = await questionAsync("Entrez votre mot de passe : ");
            var passwordVerif = await questionAsync("Entrez a nouveau votre mot de passe : ");
            if (password == passwordVerif) {
                samePassword = true;
            } else {
                console.log("Erreur : vos deux mots de passe sont différents. Veuillez recommencer.");
            }
        }
        //On crée le string qui va être injecté dans le fichier
        var userLoginInfos = '\r\nUsername:' + userName + '-Password:' + password;
        let typeUtilisateur = await questionAsync("Votre utilisateur est enseignant (1) ou SYREM (2)?");
        switch(typeUtilisateur){
            case '1' : fs.appendFileSync('./loginFile/userLogins.txt', userLoginInfos);console.log("Compte enregistré !");break;
            case '2' : fs.appendFileSync('./loginFile/adminLogins.txt', userLoginInfos);console.log("Compte enregistré !");break;
            default: console.log("Utilisateur non enregistrer veuillez réesseyer");
        }
    } else {
        console.log("Choix invalide, veuillez recommencer.");
    }
}




module.exports = accountConnexion;