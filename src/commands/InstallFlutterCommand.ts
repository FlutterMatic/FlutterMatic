import { homedir } from "os";
import { join } from "path";

import { createInstallationDirectory } from "../createDirectory";
import { checkIfFlutterIsInstalled } from "../dependencies/checkForFlutter";
import { checkForGit } from "../dependencies/checkForGit";
import {
  configureFlutter,
  gitClone,
  installFlutter,
} from "../installer/installFlutter";
import { error, info } from "../logger";
import { getShell, setPath } from "../setPath";
import { DashboardCommandHandler } from "./DashboardCommand";

export class InstallFlutterCommand {
  dashboardCommandHandler: DashboardCommandHandler;

  constructor(dashboardCommandHandler: DashboardCommandHandler) {
    this.dashboardCommandHandler = dashboardCommandHandler;
  }

  async run() {
    this.dashboardCommandHandler.updateOutputList({
      info: "Starting installation process",
      success: true,
    });

    this.dashboardCommandHandler.updateOutputList(
      info("Checking for dependencies")
    );

    const gitOutput = await checkForGit();
    if (!gitOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(gitOutput.error!!));
      return;
    }

    const flutterOutput = await checkIfFlutterIsInstalled();
    if (flutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(flutterOutput.info!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "All dependencies present. Proceeding to create installation directory"
      )
    );

    const createInstallationDirectoryOutput = await createInstallationDirectory();
    if (!createInstallationDirectoryOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(createInstallationDirectoryOutput.error!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info("Installation directory created. Proceeeding to clone the git repo")
    );

    const gitCloneOutput = await gitClone();
    if (!gitCloneOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(gitCloneOutput.error!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "Git Clone successful. Proceeding to installing flutter. This may take a while."
      )
    );

    const installFlutterOutput = await installFlutter();
    if (!installFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(installFlutterOutput.error!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "Flutter installation complete.Adding Flutter to PATH. "
      )
    );

    const shell = (await getShell());
    const {shellName} = shell;
    if (shellName === "") {
      this.dashboardCommandHandler.updateOutputList(error(
        "Shell name not recognized"
      ));
      return;
    }

    const pathOutput = (await setPath(shell));
    this.dashboardCommandHandler.updateOutputList(pathOutput);

    this.dashboardCommandHandler.updateOutputList(info("Enableing web"))

    const configureFlutterOutput = await configureFlutter();
    if (!configureFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(configureFlutterOutput.error!!)
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info("Enabled web version in flutter. ")
    );


    this.dashboardCommandHandler.updateOutputList(
      info("Hurray! Flutter is now installed on your system!!")
    );

    this.dashboardCommandHandler.updateOutputList(
      info(
        `1. Copy this: ${join(
          homedir(),
          ".flutter-sdktest",
          "bin",
          "flutter"
        )} create starter_web`
      )
    );

    this.dashboardCommandHandler.updateOutputList(
      info(
        `2. Copy this (after cd command):
         ${join(homedir(), ".flutter-sdktest", "bin", "flutter")} run`
      )
    );
  }
}
