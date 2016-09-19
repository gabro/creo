/* @flow */

export type Step = {
  name: string,
  run: () => Promise<StepResult>
};

export type Flow = Array<Step>;

export type StepResult = {
  skipped?: boolean
}

export type DoneStepStatus = 'success' | 'skipped' | 'error';

export type DoneStep = {
  step: Step,
  status: DoneStepStatus
};
