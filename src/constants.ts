import { homedir } from "os";
import { join } from "path";

export const EXTENSION_ID = "flutter-matic";
export const INSTALL_FLUTTER_COMMAND = "install-flutter"

export const gitCloneCommand = 
      `git clone --depth 1 --branch beta https://github.com/flutter/flutter.git "${join(
        homedir(),
        ".flutter-sdktest"
      )}"`;

export const flutterCommand = `flutter`;
export const configEnableWebFlutter = `flutter config --enable-web`;
