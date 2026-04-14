import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';

export const version = JSON.parse(readFileSync(resolve(cwd(), 'package.json'), 'utf-8'))
  .version as string;
