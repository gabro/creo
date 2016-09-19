/* @flow */

import inquirer from 'inquirer';
import open from 'open';
import { waitForStepDone } from './shared';
import type { StepResult } from './domain';

const prompt = inquirer.createPromptModule();

export default {
  name: 'git crypt',
  run
};

async function run(): Promise<StepResult> {

  const { alreadyConfiguredGitcrypt } = await prompt({
    type: 'confirm',
    name: 'alreadyConfiguredGitcrypt',
    message: 'Did you configure git crypt already?',
  });

  const { shouldOpenBrowser } = await prompt({
    type: 'confirm',
    name: 'shouldOpenBrowser',
    message: `No problem! I'll point you to the right direction, ok?`,
    when: !alreadyConfiguredGitcrypt
  });

  if (shouldOpenBrowser) {
    //TODO: this isn't very useful per se
    const gitCryptReadme = 'https://github.com/AGWA/git-crypt';
    open(gitCryptReadme);
  }

  if (!alreadyConfiguredGitcrypt) {
    await waitForStepDone();
  }

  return {};
}

