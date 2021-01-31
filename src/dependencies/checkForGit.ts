import { gitCheckCommand, gitInstalled, gitNotInstalled } from "../constants";
import { Output } from "../Output";
import { exec } from "../runCommand";

export async function checkForGit(): Promise<Output> {
  try {
    await exec(gitCheckCommand);
    return { info: gitInstalled, success: true };
  } catch (e: any) {
    return { error: `${gitNotInstalled}\n${e.message}`, success: false };
  }
}
