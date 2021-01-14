import { Output } from "../Output";
import { exec } from "../runCommand";

export async function checkForVSCodeCLI(): Promise<Output> {
  try {
    await exec("code --version");
    return { info: "VSCode is installed", success: true };
  } catch (e: any) {
    return { error: `VSCode is not installed\n${e.message}`, success: false };
  }
}