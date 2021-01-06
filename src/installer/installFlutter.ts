import { download, extract } from "gitly";
import { homedir } from "os";
import { join } from "path";
import { Output } from "../Output";
import { exec } from "../runCommand";

export async function gitClone(): Promise<Output> {
  try {
    if (process.platform === "win32") {
      const tarFLutterSDK = await download('https://github.com/flutter/flutter.git#beta');
      await extract(tarFLutterSDK, join(
        homedir(),
        ".flutter-sdktest"
      ));
    }
    else {
      await exec(
        `git clone --depth 1 --branch beta https://github.com/flutter/flutter.git ${join(
          homedir(),
          ".flutter-sdktest"
        )}`
      );
    }
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
    await exec(`${join(homedir(), ".flutter-sdktest", "bin", "flutter")}`);
    return { success: true, info: "Flutter installed successfully" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function configureFlutter(): Promise<Output> {
  try {
    await exec(
      `${join(
        homedir(),
        ".flutter-sdktest",
        "bin",
        "flutter"
      )} config --enable-web`
    );
    return { success: true, info: "Flutter configuration complete!" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
