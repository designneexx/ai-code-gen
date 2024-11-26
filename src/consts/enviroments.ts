import 'dotenv/config';

const DEFAULT_PORT = 3002;

export const enviroments = {
  openAiApiKey: process.env.OPEN_AI_API_KEY || '',
  openAiBaseURL: process.env.OPEN_AI_BASE_URL || '',
  port: process.env.PORT || DEFAULT_PORT
};
