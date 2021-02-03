import { homedir } from "os";
import { join } from "path";

export const EXTENSION_ID = "flutter-matic";
export const INSTALL_FLUTTER_COMMAND = "install-flutter";

export const gitCloneCommand = (process.platform === 'win32') ?
  `git clone --branch beta https://github.com/flutter/flutter.git "${join(
    homedir(),
    ".flutter-sdktest"
  )}"` :
  `git clone --depth 1 --branch beta https://github.com/flutter/flutter.git "${join(
    homedir(),
    ".flutter-sdktest"
  )}"`;

export const flutterCommand = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")}`;
export const flutterInitCommand = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")} doctor`;
export const configEnableWebFlutter = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")} config --enable-web`;

export const flutterCheckCommand = "flutter --version";
export const flutterInstalled = "Flutter is installed!";
export const flutterNotInstalled = "Flutter is not installed!";

export const vscodeCheckCommand = "code --version";
export const vscodeOnPath = "VSCode is on Path!";
export const vscodeNotOnPath = "VSCode is not on Path!";

export const gitCheckCommand = "git --version";
export const gitInstalled = "Git is installed";
export const gitNotInstalled = "Git is not installed";
