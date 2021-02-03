import { homedir } from "os";
import { join } from "path";

// VSCode extension
export const EXTENSION_ID = "flutter-matic";
export const INSTALL_FLUTTER_COMMAND = "install-flutter";

// Flutter Installation commands
export const gitCloneCommand =
  `git clone --depth 1 --branch beta https://github.com/flutter/flutter.git "${join(
    homedir(),
    ".flutter-sdktest"
  )}"`;

export const flutterCommand = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")}`;
export const flutterInitCommand = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")} doctor`;
export const configEnableWebFlutter = `${join(homedir(), ".flutter-sdktest", "bin", "flutter")} config --enable-web`;

// Dependency check commands
export const flutterCheckCommand = "flutter --version";
export const flutterInstalled = "Flutter is installed!";
export const flutterNotInstalled = "Flutter is not installed!";

export const vscodeCheckCommand = "code --version";
export const vscodeOnPath = "VSCode is on Path!";
export const vscodeNotOnPath = "VSCode is not on Path!";

export const gitCheckCommand = "git --version";
export const gitInstalled = "Git is installed";
export const gitNotInstalled = "Git is not installed";

// Info and error messages
export const gitCloneSuccess = "Successfully cloned git repo";
export const gitCloneError = "Error cloning flutter repo";
export const flutterInstallSuccess = "Flutter installed successfully";
export const defaultProjectName = "flutter_matic_starter_project";
export const flutterConfigureSuccess = "Flutter configuration complete!";
export const flutterWebAppCreated = "Flutter WebApp created";
export const openVsCode = "Please open VSCode in the directory to start coding. We could not open vscode for you as you do not have it on path!";
export const checkForDependencies = "Checking for dependencies";
export const startInstallProcess = "Starting installation process";
export const flutterInstallDone = "Flutter installation complete. Adding Flutter to PATH.";
export const flutterInstallComplete = "Hurray! Flutter is now installed on your system!!\nNow you may click the \"Create web app button to create a new app!\"";
export const enableWebSDK = "Flutter added to PATH. Proceeding to enabling web sdk for flutter.";
export const startFlutterInstall = "Git Clone successful. Proceeding to installing flutter. This may take a while.";
export const shellNameNotRecognized = "Shell name not recognized";
export const startGitClone = "Installation directory created. Proceeeding to clone the git repo";
export const createInstallDir = "All dependencies present. Proceeding to create installation directory";
