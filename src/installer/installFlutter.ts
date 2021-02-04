import { Output } from '../Output';
import { exec } from '../runCommand';

import {
  flutterWebAppCreated,
  gitCloneSuccess,
  gitCloneError,
  flutterInstallSuccess,
  flutterConfigureSuccess,
  defaultProjectName,
  gitCloneCommand,
  flutterCommand,
  configEnableWebFlutter,
  flutterInitCommand,
} from '../constants';

export async function gitClone(): Promise<Output> {
  try {
    await exec(gitCloneCommand);
    return { success: true, info: gitCloneSuccess };
  } catch (e: any) {
    return {
      success: false,
      error: `${gitCloneError}\n${e.message}`,
    };
  }
}
export async function installFlutter(): Promise<Output> {
  try {
    await exec(flutterCommand);
    await exec(flutterInitCommand);
    return { success: true, info: flutterInstallSuccess };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function configureFlutter(): Promise<Output> {
  try {
    await exec(configEnableWebFlutter);
    return { success: true, info: flutterConfigureSuccess };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createFlutterWebApp(
  path: string,
  name = defaultProjectName
): Promise<Output> {
  try {
    await exec(`flutter create ${name}`, { cwd: path });
    return { success: true, info: flutterWebAppCreated };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
