import { Output } from "../Output";
import { exec } from "../runCommand";

export async function checkForGit(): Promise<Output> {
  try {
    await exec("git --version");
    return { info: "Git is installed", success: true };
  } catch (e: any) {
    return { error: `Git is not installed\n${e.message}`, success: false };
  }
}
