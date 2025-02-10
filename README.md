# Mistral AI Discord Bot

Un bot Discord interactif qui utilise l'API Mistral AI pour répondre aux questions des utilisateurs, tout en offrant une interface de commandes slash simple et pratique.

## Fonctionnalités

- **Commandes Slash** : Permet d'interroger Mistral AI via des commandes slash (`/mistral` et `/help`).
- **Réponses dynamiques** : Le bot affiche les réponses sous forme de messages "embed" pour une lisibilité optimale.
- **Gestion des erreurs** : Le bot gère les erreurs d'exécution et informe les utilisateurs en cas de problème.
- **Commande d'aide** : Le bot fournit des informations sur les commandes disponibles.

## Prérequis

Avant d'exécuter ce projet, vous devez disposer des éléments suivants :

- **Node.js** (version 16 ou supérieure)
- **Clé API Discord** : Créez une application Discord et récupérez le token de votre bot.
- **Clé API Mistral** : Une clé API valide pour interagir avec l'API Mistral AI.

## Installation

1. Clonez ce repository :

   > ```bash
   > git clone https://github.com/ton-utilisateur/mistral-ai-discord-bot.git
   > ```

2. Accédez au répertoire du projet :

   > ```bash
   > cd mistral-ai-discord-bot
   > ```

3. Installez les dépendances :

   > ```bash
   > npm install
   > ```

4. Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :

   > ```ini
   > DISCORD_TOKEN=your-discord-bot-token
   > MISTRAL_API_KEY=your-mistral-api-key
   > CLIENT_ID=your-discord-client-id
   > ```

   - **`DISCORD_TOKEN`** : Le token de votre bot Discord.
   - **`MISTRAL_API_KEY`** : Votre clé API pour interagir avec l'API Mistral AI.
   - **`CLIENT_ID`** : L'ID client de votre application Discord.

5. Déployez les commandes slash dans votre serveur Discord en exécutant :

   > ```bash
   > npm run deploy-commands
   > ```

   Cette commande va déployer les commandes slash définies dans le fichier `commands.js`.

## Utilisation

Après avoir déployé les commandes et lancé le bot, vous pouvez interagir avec lui en utilisant les commandes slash suivantes dans Discord :

- **`/mistral <question>`** : Posez une question à Mistral AI. Exemple : `/mistral Quelle est la capitale de la France ?`
- **`/help`** : Affiche la liste des commandes disponibles et leur description.

### Exemple d'utilisation

1. Tapez `/mistral Quelle est la capitale de la France ?` dans Discord.
2. Le bot enverra une réponse sous forme de message embed.
3. Si la réponse de Mistral AI est trop longue, le bot divise la réponse en plusieurs messages.

## Structure du projet

- **`index.js`** : Fichier principal qui initialise le bot Discord et gère les événements (connexion, interaction, etc.).
- **`commands.js`** : Contient la logique des commandes disponibles pour le bot.
- **`deploy-commands.js`** : Déploie les commandes slash sur Discord.
- **`services/mistral.js`** : Gère la communication avec l'API Mistral AI.
- **`utils/logger.js`** : Gère les logs du bot.
- **`utils/permissions.js`** : Vérifie les permissions avant d'exécuter une commande.
- **`utils/validateEnv.js`** : Vérifie que les variables d'environnement sont correctement configurées avant de démarrer.

## Contribuer

Si vous souhaitez contribuer à ce projet :

1. Forkez ce repository.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`).
3. Committez vos changements (`git commit -am 'Ajout d\'une fonctionnalité'`).
4. Poussez à votre branche (`git push origin feature/ma-fonctionnalite`).
5. Ouvrez une Pull Request.

## License

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.
