/* @flow */

import inquirer from 'inquirer';
import open from 'open';
import { waitForStepDone } from './shared';
import 'colors';
import type { Step, StepResult } from './domain';

const prompt = inquirer.createPromptModule();

export default {
  name: 'GitHub repo',
  run
};

async function run(): Promise<StepResult> {

  const { alreadyHasGithubRepo } = await prompt({
    type: 'confirm',
    name: 'alreadyHasGithubRepo',
    message: 'Did you create a GitHub repo already?',
  });

  const { shouldOpenBrowser } = await prompt({
    type: 'confirm',
    name: 'shouldOpenBrowser',
    message: `No problem! I'll point you to the right direction, ok?`,
    when: !alreadyHasGithubRepo
  });

  if (shouldOpenBrowser) {
    const newRepoUrl = 'https://github.com/organizations/buildo/repositories/new';
    open(newRepoUrl);
  }

  if (!alreadyHasGithubRepo) {
    await waitForStepDone();
  }

  return {};
}
