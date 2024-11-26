import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { enviroments } from './consts/enviroments.js';
import { createJSDocGeneratorRouteFactory } from './utils/createJSDocGeneratorRouteFactory.js';

const { port } = enviroments;

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

app.post('/interface', createJSDocGeneratorRouteFactory({ userPromptSrc: 'interfacePrompt.md' }));

app.post('/function', createJSDocGeneratorRouteFactory({ userPromptSrc: 'functionPrompt.md' }));

app.post('/enum', createJSDocGeneratorRouteFactory({ userPromptSrc: 'enumPrompt.md' }));

app.post('/type-alias', createJSDocGeneratorRouteFactory({ userPromptSrc: 'typeAliasPrompt.md' }));

app.post(
  '/variable-statement',
  createJSDocGeneratorRouteFactory({ userPromptSrc: 'variableStatementPrompt.md' })
);

app.post('/class', createJSDocGeneratorRouteFactory({ userPromptSrc: 'classPrompt.md' }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
