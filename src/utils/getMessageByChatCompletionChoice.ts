import { lexer } from 'marked';
import OpenAI from 'openai';
import { getTextByCodeTokenMD } from './getTextByCodeTokenMD.js';

export function getMessageByChatCompletionChoice(
  acc: string,
  response: OpenAI.Chat.Completions.ChatCompletion.Choice
) {
  const content = response.message.content || '';

  const tokens = lexer(content);
  const codeTokenValues = tokens.reduce(getTextByCodeTokenMD, '');

  return `${acc}${codeTokenValues}`;
}
