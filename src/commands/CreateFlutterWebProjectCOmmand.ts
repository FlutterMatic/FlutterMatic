import * as vscode from "vscode";

import { createFlutterWebApp } from "../installer/installFlutter";
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
      info: folderPath,
      success: true,
    });

    const projectName = await vscode.window.showInputBox({
      value: "flutter_matic_starter_project",
    });

    if (!projectName) {
      vscode.window.showErrorMessage("Can not be empty");
      return;
    }

    // Do a better regex based match later on
    if (projectName?.includes("-")) {
      vscode.window.showErrorMessage(
        "Follow the dart package name guidelines!"
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      await createFlutterWebApp(folderPath, projectName)
    );
  }
}
