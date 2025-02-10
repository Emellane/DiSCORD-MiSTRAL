import { REST, Routes } from 'discord.js';
import { commands } from './commands.js';
import { logger } from './utils/logger.js';
import { validateEnvironment } from './utils/validateEnv.js';

// Valider l'environnement avant de continuer
validateEnvironment();

// Créer une nouvelle instance REST avec le token
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

export async function setupCommands() {
  try {
    logger.info('Début du déploiement des commandes...');

    // Convertir les commandes en JSON
    const commandsData = commands.map(command => command.toJSON());

    // Déployer les commandes globalement
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commandsData }
    );

    logger.info(`Commandes déployées avec succès ! (${data.length} commandes)`);
  } catch (error) {
    if (error.code === 50001) {
      logger.error('Erreur d\'autorisation: Vérifiez que le token Discord est valide et que le bot a les permissions nécessaires');
    } else {
      logger.error('Erreur lors du déploiement des commandes:', error);
    }
    throw error;
  }
}