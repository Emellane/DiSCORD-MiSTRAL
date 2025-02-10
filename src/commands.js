import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { mistralAI } from './services/mistral.js';
import { logger } from './utils/logger.js';
import { checkPermissions } from './utils/permissions.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('mistral')
    .setDescription('Poser une question à Mistral AI')
    .addStringOption(option =>
      option
        .setName('question')
        .setDescription('Votre question pour Mistral AI')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Afficher l\'aide du bot'),
];

function createHelpEmbed() {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('🤖 Aide du Bot Mistral')
    .setDescription('Voici la liste des commandes disponibles:')
    .addFields(
      { name: '/mistral', value: 'Poser une question à Mistral AI\nExemple: `/mistral question:Quelle est la capitale de la France?`' },
      { name: '/help', value: 'Afficher ce message d\'aide' }
    )
    .setFooter({ text: 'Bot Mistral AI - v1.0.0' });
}

export async function handleCommand(interaction) {
  if (!checkPermissions(interaction)) {
    await interaction.reply({
      content: "Vous n'avez pas la permission d'utiliser cette commande.",
      ephemeral: true
    });
    return;
  }

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'mistral':
        await handleMistralCommand(interaction);
        break;
      case 'help':
        await interaction.reply({ embeds: [createHelpEmbed()], ephemeral: true });
        break;
      default:
        await interaction.reply({
          content: "Commande inconnue. Utilisez /help pour voir la liste des commandes disponibles.",
          ephemeral: true
        });
    }
  } catch (error) {
    logger.error(`Erreur lors de l'exécution de la commande ${commandName}:`, error);
    await handleError(interaction, error);
  }
}

async function handleError(interaction, error) {
  const errorMessage = "Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer plus tard.";
  
  try {
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else if (!interaction.replied) {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    }
  } catch (e) {
    logger.error('Erreur lors de la gestion de l\'erreur:', e);
  }
}

async function handleMistralCommand(interaction) {
  await interaction.deferReply();

  try {
    const question = interaction.options.getString('question');
    const responseChunks = await mistralAI.getCompletion(question);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Réponse de Mistral AI')
      .setDescription(`**Question:** ${question}`)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    for (const chunk of responseChunks) {
      const responseEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setDescription(chunk);
      
      await interaction.followUp({ embeds: [responseEmbed] });
    }
  } catch (error) {
    await handleError(interaction, error);
  }
}