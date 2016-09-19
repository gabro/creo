/* @flow */

import inquirer from 'inquirer';
import open from 'open';
import { waitForStepDone, log } from './shared';
import type { StepResult } from './domain';

const prompt = inquirer.createPromptModule();

export default {
  name: 'prisma',
  run
};

async function run(): Promise<StepResult> {

  const { wantsActivatePrisma } = await prompt({
    type: 'confirm',
    name: 'wantsActivatePrisma',
    message: 'Do you want to enable prisma?'
  });

  if (!wantsActivatePrisma) {
    return { skipped: true };
  }

  const { alreadyHasTrelloBoard } = await prompt({
    type: 'confirm',
    name: 'alreadyHasTrelloBoard',
    message: 'Did you create a trello board already?',
  });

  const { shouldOpenTrello } = await prompt({
    type: 'confirm',
    name: 'shouldOpenTrello',
    message: `No problem! I'll point you to the right direction, ok?`,
    when: !alreadyHasTrelloBoard
  });

  if (shouldOpenTrello) {
    const trelloUrl = 'https://trello.com/buildo';
    open(trelloUrl);
  }

  if (!alreadyHasTrelloBoard) {
    await waitForStepDone();
  }

  const { alreadyConfiguredPrisma } = await prompt({
    type: 'confirm',
    name: 'alreadyConfiguredPrisma',
    message: 'Did you configure the trello/github intergration?',
  });

  if (!alreadyConfiguredPrisma) {
    log('No problem, you need to add your configuration in the buildo/prisma repo');
  }

  const { shouldOpenPrismaRepo } = await prompt({
    type: 'confirm',
    name: 'shouldOpenPrismaRepo',
    message: `I'll point you to the right direction, ok?`,
    when: !alreadyConfiguredPrisma
  });

  if (shouldOpenPrismaRepo) {
    const prismaRepoUrl = 'https://github.com/buildo/prisma/blob/master/config-ci.json';
    open(prismaRepoUrl);
  }

  if (!alreadyConfiguredPrisma) {
    await waitForStepDone();
  }

  return {};
}
