import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { splitMessage } from '../utils/messageUtils.js';
import { logger } from '../utils/logger.js';

dotenv.config();

const MISTRAL_API_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

class MistralAI {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("Clé API Mistral manquante ! Vérifiez votre fichier .env");
    }
    this.apiKey = apiKey;
  }

  async getCompletion(prompt, retryCount = 0) {
    try {
      const requestBody = {
        model: "mistral-medium",
        messages: [
          { role: "system", content: "Tu es une IA qui répond toujours en français de manière claire et concise. Tu fournis des réponses précises et utiles." },
          { role: "user", content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        random_seed: null
      };

      logger.info("Envoi de la requête à Mistral AI");

      const response = await fetch(MISTRAL_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 429 && retryCount < MAX_RETRIES) {
          logger.warn(`Rate limit atteint, nouvelle tentative ${retryCount + 1}/${MAX_RETRIES}`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return this.getCompletion(prompt, retryCount + 1);
        }
        throw new Error(`Erreur API Mistral: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) {
        throw new Error("Réponse vide de Mistral AI");
      }
      return splitMessage(reply);
    } catch (error) {
      logger.error("Erreur lors de la communication avec Mistral AI:", error);
      throw error;
    }
  }

  async getAvailableModels() {
    try {
      const response = await fetch("https://api.mistral.ai/v1/models", {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des modèles: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      logger.error("Erreur lors de la récupération des modèles:", error);
      throw error;
    }
  }
}

export const mistralAI = new MistralAI(process.env.MISTRAL_API_KEY);