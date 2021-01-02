import * as vscode from "vscode";

import { homedir } from "os";
import { join } from "path";
import { EXTENSION_ID } from "./constants";
import { checkForGit } from "./dependencies/checkForGit";
import { error, info } from "./logger";
import { checkIfFlutterIsInstalled } from "./dependencies/checkForFlutter";
import {
  configureFlutter,
  gitClone,
  installFlutter,
} from "./installer/installFlutter";
import { createInstallationDirectory } from "./createDirectory";
import { dashboardCommand } from "./commands/DashboardCommand";

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "flutter-matic-auto-install" is now active!'
  );

  const installFlutterCommand = vscode.commands.registerCommand(
    `${EXTENSION_ID}.helloWorld`,
    async () => {
      info("Checking for dependencies");

      const gitOutput = await checkForGit();
      if (!gitOutput.success) {
        error(gitOutput.error!!);
      }

      const flutterOutput = await checkIfFlutterIsInstalled();
      if (flutterOutput.success) {
        error(flutterOutput.info!!);
      }

      info(
        "All dependencies present. Proceeding to create installation directory"
      );

      const createInstallationDirectoryOutput = await createInstallationDirectory();
      if (!createInstallationDirectoryOutput.success) {
        error(createInstallationDirectoryOutput.error!!);
        return;
      }

      info("Installation directory created. Proceeeding to clone the git repo");

      const gitCloneOutput = await gitClone();
      if (!gitCloneOutput.success) {
        error(gitCloneOutput.error!!);
        return;
      }

      info(
        "Git Clone successful. Proceeding to installing flutter. This may take a while."
      );

      const installFlutterOutput = await installFlutter();
      if (!installFlutterOutput.success) {
        error(installFlutterOutput.error!!);
        return;
      }

      info(
        "Flutter installation complete. Proceeding to enable web version in flutter sdk"
      );

      const configureFlutterOutput = await configureFlutter();
      if (!configureFlutterOutput.success) {
        error(configureFlutterOutput.error!!);
        return;
      }

      info("Hurray! Flutter is now installed on your system!!");

      info(
        `1. Copy this: ${join(
          homedir(),
          ".flutter-sdktest",
          "bin",
          "flutter"
        )} create starter_web`
      );

      info(
        `2. Copy this (after cd command):
         ${join(homedir(), ".flutter-sdktest", "bin", "flutter")} run`
      );
    }
  );

  context.subscriptions.push(installFlutterCommand);
  context.subscriptions.push(await dashboardCommand(context));
}

export function deactivate() {}
