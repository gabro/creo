/* @flow */

import inquirer from 'inquirer';
import type { StepResult } from './domain';

const prompt = inquirer.createPromptModule();

export default {
  name: 'nemobot',
  run
};

async function run(): Promise<StepResult> {

  await prompt({
    type: 'list',
    name: 'happy',
    message: 'nemobot has been automatically activated on this repo! Are you happy?',
    choices: ['Yes', 'Yes']
  });

  return {};

}

