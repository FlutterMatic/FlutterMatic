import { Output } from "../Output";
import { exec } from "../runCommand";

export async function checkIfFlutterIsInstalled(): Promise<Output> {
  try {
    await exec("flutter --version");
    return { info: "Flutter is installed!", success: true };
  } catch (e: any) {
    return { error: `Flutter is not installed!\n${e.message}`, success: false };
  }
}
