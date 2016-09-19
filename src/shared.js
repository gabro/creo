/* @flow */

import inquirer from 'inquirer';
import c from 'colors/safe';

export async function waitForStepDone(): Promise<void> {

  const { done } = await inquirer.prompt({
    type: 'confirm',
    name: 'done',
    message: 'Are you done?'
  });

  if (!done) {
    await waitForStepDone();
  }

}

export function log(message: string) {
  console.log(c.bold(`  ${message}`));
}
