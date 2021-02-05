import { join } from 'path';
import * as vscode from 'vscode';
import {
  defaultProjectName,
  startWebApp,
  pickOneFolder,
  dartPackageFormat,
  projectNameEmpty,
  openVsCode,
} from '../constants';
import { checkForVSCodeCLI } from '../dependencies/checkForVSCode';

import { createFlutterWebApp } from '../installer/installFlutter';
import { error } from '../logger';
import { exec } from '../runCommand';
import { DashboardCommandHandler } from '../webview/dashboard/DashboardCommandHandler';

export class CreateFlutterWebProjectCommand {
  /*
   * Command Class for creating a flutter web project
   * - Open a folder picker or use the current workspace
   * - Ask for project name (Default: `flutter_matic_starter_project`
   * - Run `flutter create ${name}`
   * - Open VSCode in the new project directory (Error if not in $PATH)
   */

  dashboardCommandHandler: DashboardCommandHandler;

  constructor(dashboardCommandHandler: DashboardCommandHandler) {
    this.dashboardCommandHandler = dashboardCommandHandler;
  }
  async run() {
    this.dashboardCommandHandler.updateOutputList({
      info: startWebApp,
      success: true,
    });

    const currentWorkspace = vscode.workspace.workspaceFolders;

    let folderPath = '';

    // Show folder picker if workspace does not exist
    if (!currentWorkspace) {
      const file = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
      });
      if (!file) {
        vscode.window.showErrorMessage(pickOneFolder);
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
    this.dashboardCommandHandler.updateOutputList({
      info: dartPackageFormat,
      success: true,
    });

    const projectName = await vscode.window.showInputBox({
      value: defaultProjectName,
    });

    if (!projectName) {
      vscode.window.showErrorMessage(projectNameEmpty);
      return;
    }

    // TODO Do a better regex based match later on
    if (projectName?.includes('-') || projectName?.includes(' ')) {
      vscode.window.showErrorMessage(dartPackageFormat);
      this.dashboardCommandHandler.updateOutputList(error(''));
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      await createFlutterWebApp(folderPath, projectName)
    );

    // Open project in a new window
    const vsCodeCliOutput = await checkForVSCodeCLI();
    if (vsCodeCliOutput.success) {
      await exec(`code ${join(folderPath, projectName)}`);
    } else {
      this.dashboardCommandHandler.updateOutputList(error(openVsCode));
    }
  }
}
