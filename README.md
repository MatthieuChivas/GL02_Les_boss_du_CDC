# GL02_Les_boss_du_CDC

Description : Ce projet permet à un professeur de créer un test à partir d'une banque de questions. Après s'être connecté, il pourra sélectionner et déselectionner des questions, visualiser son test puis l'exporter.

Il permet également à la SRYEM de visualiser des statistiques sur les différents tests réalisés par les enseignants.

Enfin, ce projet offre la possibilité de générer une Vcard.

### Installation

Avoir accès à un éditeur de code type Visual Studio Code (https://code.visualstudio.com/Download)
Installer node sur votre ordinateur : https://nodejs.org/en/download/

Dans le dossier du projet, installer les dépendances suivantes sur votre console avant le lancement du projet :
$ npm install vega-lite
$ npm install vega
$ npm install readline
$ npm install fs
$ npm install colors
$ npm install chevrotain

# Jeux de données

La banque de questions se trouve dans le dossier "questions_data" et est catégorisée par matière.
Chaque matière a son propre dossier où se trouve l'ensemble des questions au format .gift.

Pour le moment, il n'existe que la matière "Anglais" qui sont les données fournies. Il existe aussi un dossier "Autre" qui contient l'exemple d'un fichier .gift du site de Moodle.

Pour l'identification, les utlisateurs et leurs mot de passe sont stockés dans le dossier loginFile.

Pour ce qui est de leur fichier d'identification dans le format VCard, elle se trouve dans le dossier userVcf.

### Utilisation :

Aller dans le dossier principal "GL02_Les_Boss_Du_CDC-viet".
Entrer "node main.js" dans la console pour lancer le programme.
Suivre les instructions indiquées par la console.

### Liste des contributeurs

M. Hoang-Viet Lê (hoang_viet.le@utt.fr), M. Vigny Brayan Takam Talla (vigny_brayan.takam_talla@utt.fr), M. Louis Delhomme (louis.delhomme@utt.fr), Mme Clémence Vu (clemence.vu@utt.fr) M. Chivas (matthieu.chivas@utt.fr), M. Florian Bonelli (florian.bonelli@utt.fr), M. Adrien Laugier (adrien.laugier@utt.fr), Mme Jeanne Raynaud (jeanne.raynaud@utt.fr), Mme Alice Tréché (alice.treche@utt.fr)
