/* @flow */

import inquirer from 'inquirer';
import github from './github';
import nemobot from './nemobot';
import prisma from './prisma';
import gitcrypt from './gitcrypt';
import c from 'colors/safe';
import imgcat from 'imgcat';
import path from 'path';

import type { Step, Flow, DoneStep, DoneStepStatus } from './domain';


const stepsDone = [];
const errors = [];

function printStepsDone(steps: Array<DoneStep>) {
  clearConsole();
  steps.forEach(({ step, status }) => {
    const icons: {[_: DoneStepStatus]: string} = {
      success: '✅',
      skipped: '◻️',
      error: '❌'
    };
    const colors: {[_: DoneStepStatus]: string} = {
      success: 'green',
      skipped: 'gray',
      error: 'red'
    };
    const suffix = status === 'skipped' ? '(skipped)' : '';
    const message = `${icons[status]}  ${step.name} ${suffix}`;
    console.log(c[colors[status]](message));
  });
}

async function runStep(step: Step) {
  try {
    const { skipped } = await step.run();
    stepsDone.push({ step, status: skipped ? 'skipped' : 'success' });
  } catch (e) {
    errors.push(e);
    stepsDone.push({ step, status: 'error'  });
  }
  printStepsDone(stepsDone);
}

function runFlow(flow: Flow) {
  return flow.reduce(
    (prev, step) => prev.then(() => runStep(step)),
    Promise.resolve()
  );
}

const allSteps = [github, nemobot, prisma, gitcrypt];
const flows = {
  webappFlow: {
    name: 'react app + scala backend',
    steps: allSteps
  }
};

async function selectFlow(): Promise<Flow> {
  const { selectedFlow } = await inquirer.prompt({
    type: 'list',
    name: 'selectedFlow',
    message: `Select a standard flow or 'custom' to manually choose steps`,
    choices: [
      ...Object.keys(flows).map(k => ({ value: k, name: flows[k].name })),
      { value: 'custom', name: 'custom' }
    ]
  });

  if (selectedFlow !== 'custom') {
    return flows[selectedFlow].steps;
  }

  const { selectedSteps } = await inquirer.prompt({
    type: 'checkbox',
    name: 'selectedSteps',
    message: 'Choose the steps you need',
    choices: allSteps.map(step => step.name)
  });

  return allSteps.filter(s => selectedSteps.indexOf(s.name) !== -1);
}

async function main() {
  const flow = await selectFlow();
  await runFlow(flow);
  console.log();
  console.log(c.green(`🚀  You're all set!`));
  console.log(c.bold(`👋  Goodbye!`));

  if (errors.length > 0) {
    errors.forEach(console.log.bind(console));
  }
}

function clearConsole() {
  process.stdout.write('\x1Bc');
}

function printCover() {
  imgcat(path.resolve(__dirname, 'god-and-adam.gif'), { log: true });
  console.log();
}

try {
  clearConsole();
  console.log('🖖  Greetings, hooman!\n')
  printCover();
  main();
} catch (e) {
  console.log(e);
}
