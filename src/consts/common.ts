import OpenAI from 'openai';
import { enviroments } from './enviroments';

const { openAiApiKey, openAiBaseURL } = enviroments;

export const openai = new OpenAI({
  apiKey: openAiApiKey,
  baseURL: openAiBaseURL
});
