import { Client, Events, GatewayIntentBits, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
import { handleCommand } from './commands.js';
import { setupCommands } from './deploy-commands.js';
import { logger } from './utils/logger.js';
import { validateEnvironment } from './utils/validateEnv.js';

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

// Événement déclenché quand le bot est prêt
client.once(Events.ClientReady, async (c) => {
  logger.info(`Bot prêt ! Connecté en tant que ${c.user.tag}`);
  try {
    await setupCommands();
  } catch (error) {
    logger.error('Erreur lors du déploiement des commandes:', error);
    // Ne pas quitter le processus, le bot peut fonctionner même si les commandes ne sont pas déployées
  }

  // Définir le statut du bot avec une activité en rapport avec Mistral AI
  client.user.setPresence({
    activities: [{ name: "discuter avec Mistral", type: ActivityType.Playing }],
    status: "online",
  });
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