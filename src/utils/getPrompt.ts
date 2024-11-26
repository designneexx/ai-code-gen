import fs from 'fs/promises';
import path from 'path';
import parseMD from 'parse-md';

export async function getPrompt(promptSrc: string, baseSrc = process.cwd()): Promise<string> {
  const fileContents = await fs.readFile(path.join(baseSrc, 'src', 'prompts', promptSrc), 'utf-8');
  const { content } = parseMD(fileContents);

  return content;
}
