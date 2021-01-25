import { join } from "path";
import * as vscode from "vscode";
import { checkForVSCodeCLI } from "../dependencies/checkForVSCode";

import { createFlutterWebApp } from "../installer/installFlutter";
import { error } from "../logger";
import { exec } from "../runCommand";
import { DashboardCommandHandler } from "./DashboardCommand";

export class CreateFlutterWebProjectCommand {
  dashboardCommandHandler: DashboardCommandHandler;
  constructor(dashboardCommandHandler: DashboardCommandHandler) {
    this.dashboardCommandHandler = dashboardCommandHandler;
  }

  async run() {
    this.dashboardCommandHandler.updateOutputList({
      info: "Starting webapp creation",
      success: true,
    });

    const currentWorkspace = vscode.workspace.workspaceFolders;

    let folderPath = "";

    // Show folder  picker if workspace does not exist
    if (!currentWorkspace) {
      const file = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
      });
      if (!file) {
        vscode.window.showErrorMessage(
          "You need to pick one folder to continue or be in a workspace"
        );
        return;
      }
      folderPath = file[0].fsPath;
    } else {
      folderPath = currentWorkspace[0].uri.fsPath;
    }

    this.dashboardCommandHandler.updateOutputList({
      info: `Using: ${folderPath}`,
      success: true,
    });

    const projectName = await vscode.window.showInputBox({
      value: "flutter_matic_starter_project",
    });

    if (!projectName) {
      vscode.window.showErrorMessage("Project name can not be empty!");
      return;
    }

    // TODO Do a better regex based match later on
    if (projectName?.includes("-")) {
      vscode.window.showErrorMessage(
        "Follow the dart package name guidelines!"
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      await createFlutterWebApp(folderPath, projectName)
    );

    // Open project in a new window
    const vsCodeCliOutput = await checkForVSCodeCLI();
    if (vsCodeCliOutput.success) {
      await exec(`code ${join(folderPath, projectName)}`);
    }

    this.dashboardCommandHandler.updateOutputList(error(`Please open VSCode in the directory to start coding. We could not open vscode for you as you do not have it on path!`));
  }
}
