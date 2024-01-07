# GL02_Les_boss_du_CDC

# Aide et installation

- Vous avez reçu le fichier .zip "SujetA_Les_Boss_du_cdc_l2.zip",
- Décompressez le dossier dans votre repertoire de travail et lancez main.js avec le logiciel de votre choix, 
- Assurez vous d'avoir installé les dépendances necessaires (voir Dépendances),
- Lancez le programme avec l'environnement de travail node.js, 

# Utilisation
Ceci est un guide amené à aider les utilisateurs à utiliser le logiciel.
Les fonctionnalités diffèrent en fonction du type d'utilisateur.
Veillez à bien regarder le informations associées à votre utilisateur.


Enseignant :

- Connexion:
Au lancement du logiciel, vous devez vous connecter via vos identifiants.

Si vous n'avez pas d'identifiants, créez-vous un compte via Register.
//Notez qu'une fois que vous êtes enregistré, on vous demandera de vous Log-in via vos identifiants nouvellement crées.

Si vous en avez ou que vous venez de vous enregistrer, sélectionnez Log-in, puis Enseignant.

- Tests / Création de tests / qualité des tests etc :
Sélectionner après la connexion Parcourir la banque de question, puis le fichier voulu.
Sélectionner le fichier voulu en indiquant son nom.
Maintenant choisissez ce que vous souhaitez faire entre :

[1] Reparcourir la banque de question
[2] Sélectionner les questions du test
[3] Afficher toutes les questions sélectionnées
[4] Qualité du test       //affiche si le test possède des questions identiques et s'il compte bien entre 15 et 20 questions
[5] Simuler Test       //simule la passation d'un test
[6] Exporter Test       //exporte le test en un fichier.gift
[7] Exporter VCARD      //vous demande vos informations personnelles et crée un fichier Vcard associé à vos réponses
[8] Quitter
[0] CANCEL

Notes :
[7] Exporter VCARD, crée le fichier VCARD nommé user_votrenomd'utilisateur.vcf dans le dossier userVcf du programme.

- Exportation de fichier Vcard :
Soit sélectionner après la connexion Exporter VCARD.
Soit sélectionner depuis le fichier voulu de la banque de question Exporter VCARD.


SRYEM :


Vous possédez les mêmes droits que l'ENSEIGNANT et vous avez accès à quelques options supplémentaires. Référez-vous à l'utilisation de ENSEIGNANT pour les autres fonctionnalités.

- Connexion:
Au lancement du logiciel, vous devez vous connecter via vos identifiants.
Sélectionnez donc Log-in, puis SRYEM.

Étant un administrateur, vous ne pouvez pas enregistrer de nouveau compte SRYEM depuis l'application. Un administrateur doit vous enregistrer manuellement.

- Afficher les statistiques d'un examen / comparer deux examens :
Sélectionner après la connexion Parcourir la banque de question, puis le fichier voulu.
Sélectionner le fichier voulu en indiquant son nom.
Vous possédez les mêmes options que l'enseignant mais avec deux supplémentaires :

[8] Générer profil moyen d'un examen     //affiche les statistiques des questions du test (combien de chaque type) avec une visualisation
[9] Comparer type de question      //compare entre deux examens les types de questions (en pourcentage)

 - Creation de tests 

Vous utiliserez l'option [2] : Sélectionner les questions du test.

Vous selectionnez les questions que vous voulez du fichier que vous avez importé et vous les ajoutez à votre test.

Vous pouvez aussi retirer les questions non voulues.

L'option [4] Qualité du test vérifie la quantité de questions et l'existence d'un doublon de question.

L'option [5] Simuler Test permet de tester le test dans les conditions d'un élève.

Enfin, l'option [6] Exporter Test permet d'exporter dans un fichier .gift votre test réalisé par notre logiciel.

# Dépendances

Ci dessous les dépendances utilisées pour la réalisation du projet : 
- vega-lite -> npm install vega-lite
- vega -> npm install vega
- readline -> npm install readline
- fs -> npm install fs
- colors -> npm install colors
- chevrotain -> npm install chevrotain

# Jeux de données
La banque de questions se trouve dans le dossier "questions_data" et est catégorisée par matière.
Chaque matière a son propre dossier où se trouve l'ensemble des questions au format .gift.

Pour le moment, il n'existe que la matière "Anglais" qui sont les données fournies. Il existe aussi un dossier "Autre" qui contient l'exemple d'un fichier .gift du site de Moodle.

Pour l'identification, les utlisateurs et leurs mot de passe sont stockés dans le dossier loginFile.

Pour ce qui est de leur fichier d'identification dans le format VCard, elle se trouve dans le dossier userVcf.




### Liste des contributeurs
Louis DELHOMME, Hoang-Viet LE, Vigny Brayan TAKAM TALLA, Clémence VU
M. Chivas (matthieu.chivas@utt.fr), M. Florian Bonelli (florian.bonelli@utt.fr), M. Adrien Laugier (adrien.laugier@utt.fr), Mme Jeanne Raynaud (jeanne.raynaud@utt.fr), Mme Alice Tréché (alice.treche@utt.fr)
