import {
  type ChatCompletionCreateParamsNonStreaming,
  type ChatCompletionMessageParam
} from 'openai/resources';
import { openai } from 'src/consts/common.js';
import { SourceCode } from '../types/common.js';
import { getMessageByChatCompletionChoice } from './getMessageByChatCompletionChoice.js';
import { getPrompt } from './getPrompt.js';

export interface GenerateJSDocToCodeSnippetProps {
  userPrompt: string;
  sourceCode: SourceCode;
  chatParams?: Partial<ChatCompletionCreateParamsNonStreaming>;
  getDefaultMessages?(messages: ChatCompletionMessageParam[]): ChatCompletionMessageParam[];
}

export async function generateJSDocToCodeSnippet(
  params: GenerateJSDocToCodeSnippetProps
): Promise<string> {
  const { userPrompt, sourceCode, chatParams, getDefaultMessages = (x) => x } = params;
  const messages = chatParams?.messages || [];
  const { codeDependencies, codeSnippet } = sourceCode;
  const systemPrompt = await getPrompt('systemPrompts.md');
  const codeDependenciesPrompt = await getPrompt('codeDependenciesPrompt.md');

  function getJSDocPrompt() {
    if (codeDependencies.length > 0) {
      return `${userPrompt}\n${codeSnippet}\n\`\`\`\n${codeDependenciesPrompt}\n${codeDependencies.join('\n')}\n\`\`\``;
    }

    return `${userPrompt}\n${codeSnippet}\n\`\`\``;
  }

  const jsDocPrompt = getJSDocPrompt();
  const defaultMessages: ChatCompletionMessageParam[] = [
    {
      content: systemPrompt,
      role: 'system'
    },
    {
      content: jsDocPrompt,
      role: 'user'
    }
  ];

  const completion = await openai.chat.completions.create({
    messages: [...getDefaultMessages(defaultMessages), ...messages],
    model: 'gpt-3.5-turbo',
    response_format: {
      type: 'text',
      ...chatParams?.response_format
    },
    temperature: 0.3,
    ...chatParams
  });

  const code = completion.choices.reduce(getMessageByChatCompletionChoice, '');

  return code;
}
