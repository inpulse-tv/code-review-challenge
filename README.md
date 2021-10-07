# Code Review Challenge

[inpulse.tv](https://inpulse.tv) était présent pour l'événement [Devoxx France](https://cfp.devoxx.fr/2021/index.html) qui s'est déroulé au Palais des Congrès de Paris du 29/09/2021 au 01/10/2021. Pour l'occasion nous avions mis en place un concours sous la forme d'un quiz permettant de gagner un lot pour celui qui obtiendrait le meilleur score.

Le concours reposait sur une série de 10 questions tirées alléatoirement et basées sur des langages de programmation tel que C#, SQL, Java, CSS, HTML ou encore Go. Le joureur avait 1mn pour répondre à chaque question et devait cliquer sur la zone de l'écran tactile qu'il pensait être la bonne réponse.

Parce que chez [inpulse.tv](https://inpulse.tv) nous aimons la tech et que nous aimons la partager, nous vous proposons de découvrir le code source qui a servi de base pour la réalisation du quiz du concours Devoxx.

## Installation

> Le quiz a été développé à l'aide d'une version 14.x de [node.js](https://nodejs.org), nous vous conseillons donc d'utiliser à minima cette version pour compiler le code.

Pour télécharger et installer le quiz sur votre poste il vous suffit d'exécuter les commandes suivantes depuis un terminal :

```bash
git clone https://github.com/inpulse-tv/code-review-challenge.git
npm i
npm start
```

## Développement

Le quiz est entièrement réalisé avec la librairie [React.js](https://reactjs.org/) de Facebook. Pour les besoins du concours nous avons stocké les données sur le local storage du navigateur, mais la gestion de sauvegarde est déportée dans un service dédié (`leaderboard.service.ts`), il est donc tout à fait possible de manager les données depuis un backend classique.

De même la partie de traitement de la réponse est facilement éditable si on passe par les outils de développement du navigateur. Il conviendra de déporter cette partie vers un backend dans le cas où vous souhaiteriez utiliser le code pour des besoins plus professionels. Pour le moment, cette section n'est malheureusement pas dans un service, mais libre à vous d'en proposer une implémentation ! :smile:

Concernant le développement du quiz, nous avons opté pour une colorisation syntaxique des questions à l'aide du composant [Google Code Pretiffy](https://github.com/googlearchive/code-prettify). Nous voulions également éviter les problèmes de résolution d'écran, ne sachant pas exactement sur quel type de poste le quiz serait installé lors du salon. Il a donc été décidé que la bonne réponse serait apportée par un événement de clique via un range délimitant la zone de texte concernée. Ce qui a grandement facilité la rédaction des quiz.

## Mode debug

La version de développement dispose d'une zone de débuggage en haut à gauche de l'écran qui vous permettra de sauter rapidement d'une question à l'autre et d'en afficher la réponse. Lors de la compilation du build, cette zone est supprimée du code source.

Pour lancer un build il suffit de taper la commande suivante :

```bash
npm run build
```
