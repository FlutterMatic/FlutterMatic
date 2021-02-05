import { Output } from '../Output';
import { exec } from '../runCommand';
import { vscodeOnPath, vscodeNotOnPath, vscodeCheckCommand } from '../constants';

export async function checkForVSCodeCLI(): Promise<Output> {
  try {
    await exec(vscodeCheckCommand);
    return { info: vscodeOnPath, success: true };
  } catch (e: any) {
    return { error: `${vscodeNotOnPath}\n${e.message}`, success: false };
  }
}
