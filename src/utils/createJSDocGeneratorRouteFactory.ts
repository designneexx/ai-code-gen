import { Request, Response } from 'express';
import { SourceCode } from 'src/types/common';
import { getPrompt } from 'src/utils/getPrompt';
import {
  generateJSDocToCodeSnippet,
  GenerateJSDocToCodeSnippetProps
} from './generateJSDocToCodeSnippet';

interface CreateJSDocGeneratorRouteFactoryParams<
  Req extends Request = Request,
  Res extends Response = Response
> {
  userPromptSrc: string;
  generatorParams?: Partial<Omit<GenerateJSDocToCodeSnippetProps, 'userPrompt' | 'sourceCode'>>;
  getSourceCode?(request: Req): SourceCode;
  handleResponse?(response: Res, code: string): void;
}

interface SerializedSourceFile {
    filePath: string;
    sourceCode: string;
}

function formatSourceFile(sourceFile: SerializedSourceFile) {
  return sourceFile.sourceCode;
}

function getCodeDependencies(sourceFiles?: SerializedSourceFile[] | null) {
  if (Array.isArray(sourceFiles)) {
    return sourceFiles.map(formatSourceFile);
  }

  return [];
}

export function createJSDocGeneratorRouteFactory<Req extends Request, Res extends Response>(
  params: CreateJSDocGeneratorRouteFactoryParams<Req, Res>
) {
  const {
    userPromptSrc,
    generatorParams,
    getSourceCode = ({ body }) => ({
      codeSnippet: String(body.codeSnippet || ''),
      codeDependencies: [body.sourceCode, ...getCodeDependencies(body.codeDependencies)]
    }),
    handleResponse = (res, code) => res.json({ code })
  } = params;

  return async (request: Req, response: Res) => {
    const sourceCode = getSourceCode(request);
    const userPrompt = await getPrompt(userPromptSrc);
    const code = await generateJSDocToCodeSnippet({
      sourceCode,
      userPrompt,
      ...generatorParams
    });

    handleResponse(response, code);
  };
}
