import { Output } from "../Output";
import { exec } from "../runCommand";
import { flutterCheckCommand, flutterInstalled, flutterNotInstalled } from "../constants";

export async function checkIfFlutterIsInstalled(): Promise<Output> {
  try {
    await exec(flutterCheckCommand);
    return { info: flutterInstalled, success: true };
  } catch (e: any) {
    return { error: `${flutterNotInstalled}\n${e.message}`, success: false };
  }
}
