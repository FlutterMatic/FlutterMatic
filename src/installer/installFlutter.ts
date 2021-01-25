import { Output } from "../Output";
import { exec } from "../runCommand";

import { gitCloneCommand, flutterCommand, configEnableWebFlutter } from "../constants";

export async function gitClone(): Promise<Output> {
  try {
    await exec(gitCloneCommand);
    return { success: true, info: "Successfully cloned git repo" };
  } catch (e: any) {
    return {
      success: false,
      error: `Error cloning flutter repo\n${e.message}`,
    };
  }
}

export async function installFlutter(): Promise<Output> {
  try {
    await exec(flutterCommand);
    return { success: true, info: "Flutter installed successfully" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function configureFlutter(): Promise<Output> {
  try {
    await exec(configEnableWebFlutter);
    return { success: true, info: "Flutter configuration complete!" };
  }
  catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function createFlutterWebApp(
  path: string,
  name = "flutter_matic_starter_project"
): Promise<Output> {
  try {
    await exec(
      `flutter create ${name}`,
      { cwd: path }
    );
    return { success: true, info: "Flutter WebApp created\n" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
