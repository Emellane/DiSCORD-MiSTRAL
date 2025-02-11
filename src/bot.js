import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
import { handleCommand } from './commands.js';
import { setupCommands } from './deploy-commands.js';
import { logger } from './utils/logger.js';
import { validateEnvironment } from './utils/validateEnv.js';
import moment from 'moment-timezone';

// Charger les variables d'environnement
dotenv.config();

// Valider l'environnement avant de démarrer
validateEnvironment();

// Créer une nouvelle instance du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Liste des statuts à faire tourner pour le bot Mistral AI
const statuses = [
  { name: "discuter avec Mistral 🎙️", type: ActivityType.Playing },
  { name: "résoudre vos requêtes IA 🤖", type: ActivityType.Playing },
  { name: "analyser des données 🤓", type: ActivityType.Listening },
  { name: "apprendre de nouvelles choses 📚", type: ActivityType.Listening },
  { name: "répondre à vos questions 🤔", type: ActivityType.Listening },
  { name: "explorer le monde IA 🌍", type: ActivityType.Playing },
  { name: "évoluer avec vous 🤖✨", type: ActivityType.Playing },
  { name: "analyser des tendances IA 📊", type: ActivityType.Listening }
];

// Fonction pour choisir un statut aléatoire
function updateStatus() {
  const randomIndex = Math.floor(Math.random() * statuses.length); // Choisit un index aléatoire
  const status = statuses[randomIndex];

  client.user.setPresence({
    activities: [status],
    status: "online",
  });

  console.log(`✅ Statut mis à jour : "Mistral IA ${status.name}"`);
}

// Événement déclenché quand le bot est prêt
client.once(Events.ClientReady, async (c) => {
  logger.info(`Bot prêt ! Connecté en tant que ${c.user.tag}`);
  try {
    await setupCommands();
  } catch (error) {
    logger.error('Erreur lors du déploiement des commandes:', error);
    // Ne pas quitter le processus, le bot peut fonctionner même si les commandes ne sont pas déployées
  }

  // Définir un premier statut immédiatement
  updateStatus();

  // Changer le statut toutes les 30 secondes pour un statut aléatoire
  setInterval(updateStatus, 30000); // Mise à jour toutes les 30 secondes
});

// Gestion des commandes slash
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    await handleCommand(interaction);
  } catch (error) {
    logger.error('Erreur lors du traitement de la commande:', error);
    const errorMessage = 'Une erreur est survenue lors du traitement de votre commande.';

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Connexion du bot avec le token
client.login(process.env.DISCORD_TOKEN).catch((error) => {
  logger.error('Erreur de connexion au bot Discord:', error);
  process.exit(1);
});