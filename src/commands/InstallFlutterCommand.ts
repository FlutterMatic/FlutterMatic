import { ExtensionContext } from "vscode";
import { createInstallationDirectory } from "../createDirectory";
import { checkForGit } from "../dependencies/checkForGit";
import { configureFlutter, gitClone, installFlutter } from '../installer/installFlutter';
import { error, info } from '../logger';
import { getShell, setPath } from '../setPath';
import { DashboardCommandHandler } from '../webview/dashboard/DashboardCommandHandler';
import {
  checkForDependencies,
  startInstallProcess,
  flutterInstallDone,
  flutterInstallComplete,
  enableWebSDK,
  startFlutterInstall,
  shellNameNotRecognized,
  startGitClone,
  createInstallDir,
} from '../constants';

export class InstallFlutterCommand {
  /*
   * Command Class for installing flutter and setting it up
   * - Check if all dependencies are present
   * - Create installation directory
   * - Clone flutter repo (beta branch)
   * - install flutter (Run `flutter` and `flutter doctor`)
   * - Enable flutter `web` feature
   * - Set `$PATH` in supported shells
   * */

  dashboardCommandHandler: DashboardCommandHandler;
  context:ExtensionContext;

  constructor(dashboardCommandHandler: DashboardCommandHandler,context:ExtensionContext) {
    this.dashboardCommandHandler = dashboardCommandHandler;
    this.context = context;
  }

  async run() {
    this.dashboardCommandHandler.updateOutputList({
      info: startInstallProcess,
      success: true,
    });

    this.dashboardCommandHandler.dashboardContent.updateOptions({
      flutter: false,
      isFlutterInstalling: true,
    });

    this.dashboardCommandHandler.updateOutputList(info(checkForDependencies));

    const gitOutput = await checkForGit();
    if (!gitOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(gitOutput.error!!));
      return;
    }

    this.dashboardCommandHandler.updateOutputList(info(createInstallDir));

    const createInstallationDirectoryOutput = await createInstallationDirectory();
    if (!createInstallationDirectoryOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(createInstallationDirectoryOutput.error!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(info(startGitClone));

    const gitCloneOutput = await gitClone();
    if (!gitCloneOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(gitCloneOutput.error!!));
      return;
    }

    this.dashboardCommandHandler.updateOutputList(info(startFlutterInstall));

    const shell = await getShell();
    const { shellName } = shell;
    if (shellName === '' && process.platform !== 'win32') {
      this.dashboardCommandHandler.updateOutputList(error(shellNameNotRecognized));
      return;
    }

    const pathOutput = (await setPath(shell,this.context));
    console.log(pathOutput);
    this.dashboardCommandHandler.updateOutputList(pathOutput);

    const installFlutterOutput = await installFlutter();
    if (!installFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(installFlutterOutput.error!!));
      return;
    }

    this.dashboardCommandHandler.updateOutputList(info(flutterInstallDone));
    this.dashboardCommandHandler.updateOutputList(info(enableWebSDK));

    const configureFlutterOutput = await configureFlutter();
    if (!configureFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(configureFlutterOutput.error!!));
      return;
    }

    this.dashboardCommandHandler.dashboardContent.updateOptions({
      flutter: true,
      isFlutterInstalling: false,
    });

    this.dashboardCommandHandler.updateOutputList(info(flutterInstallComplete));
  }
}
