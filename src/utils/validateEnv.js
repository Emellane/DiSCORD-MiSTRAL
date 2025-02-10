import { logger } from './logger.js';

export function validateEnvironment() {
  const requiredVars = {
    DISCORD_TOKEN: 'Discord bot token',
    MISTRAL_API_KEY: 'Mistral AI API key',
    CLIENT_ID: 'Discord application client ID'
  };

  const missingVars = [];

  // Check for missing required variables
  for (const [varName, description] of Object.entries(requiredVars)) {
    if (!process.env[varName]) {
      missingVars.push(`${varName} (${description})`);
    }
  }

  // If any required variables are missing, log them and exit
  if (missingVars.length > 0) {
    logger.error('Missing required environment variables:');
    missingVars.forEach(variable => logger.error(`- ${variable}`));
    logger.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  // Validate Discord token format
  if (!process.env.DISCORD_TOKEN.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)) {
    logger.error('Invalid Discord token format. Please check your DISCORD_TOKEN in the .env file.');
    process.exit(1);
  }

  // Validate Client ID format (should be a numeric string)
  if (!process.env.CLIENT_ID.match(/^\d+$/)) {
    logger.error('Invalid CLIENT_ID format. The CLIENT_ID should be a numeric string.');
    process.exit(1);
  }

  // Optional variables validation
  if (process.env.ALLOWED_CHANNELS && !process.env.ALLOWED_CHANNELS.match(/^\d+(,\d+)*$/)) {
    logger.error('Invalid ALLOWED_CHANNELS format. Should be comma-separated channel IDs.');
    process.exit(1);
  }

  if (process.env.ALLOWED_ROLES && !process.env.ALLOWED_ROLES.match(/^\d+(,\d+)*$/)) {
    logger.error('Invalid ALLOWED_ROLES format. Should be comma-separated role IDs.');
    process.exit(1);
  }
}