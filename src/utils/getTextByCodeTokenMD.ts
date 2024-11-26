import { type Token } from 'marked';

export function getTextByCodeTokenMD(acc: string, token: Token) {
  return `${acc}${token.type === 'code' ? token.text : acc}`;
}
