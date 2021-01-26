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
    },
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );

    const flutterOutput = await checkIfFlutterIsInstalled();
    if (flutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(flutterOutput.info!!),
        {
          buttonName: 'create-web',
          isDisable: false
        }
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info("Checking for dependencies"),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );

    const gitOutput = await checkForGit();
    if (!gitOutput.success) {
      this.dashboardCommandHandler.updateOutputList(error(gitOutput.error!!), {
        buttonName: 'create-web',
        isDisable: true
      });
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "All dependencies present. Proceeding to create installation directory"
      ),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );

    const createInstallationDirectoryOutput = await createInstallationDirectory();
    if (!createInstallationDirectoryOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(createInstallationDirectoryOutput.error!!),
        {
          buttonName: 'create-web',
          isDisable: true
        }
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info("Installation directory created. Proceeeding to clone the git repo"),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );

    const gitCloneOutput = await gitClone();
    if (!gitCloneOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(gitCloneOutput.error!!),
        {
          buttonName: 'create-web',
          isDisable: true
        }
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "Git Clone successful. Proceeding to installing flutter. This may take a while."
      ),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );

    const shell = (await getShell());
    const { shellName } = shell;
    if (shellName === "" && process.platform !== 'win32') {
      this.dashboardCommandHandler.updateOutputList(error(
        "Shell name not recognized"
      ),
        {
          buttonName: 'create-web',
          isDisable: true
        }
      );
      return;
    }

    const pathOutput = (await setPath(shell));
    this.dashboardCommandHandler.updateOutputList(pathOutput, {
      buttonName: 'create-web',
      isDisable: true
    });


    const installFlutterOutput = await installFlutter();
    if (!installFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(installFlutterOutput.error!!),
        {
          buttonName: 'create-web',
          isDisable: true
        }
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info(
        "Flutter installation complete. Adding Flutter to PATH."
      ),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );


    this.dashboardCommandHandler.updateOutputList(info("Flutter added to PATH. Proceeding to enabling web sdk for flutter."), {
      buttonName: 'create-web',
      isDisable: true
    });

    const configureFlutterOutput = await configureFlutter();
    if (!configureFlutterOutput.success) {
      this.dashboardCommandHandler.updateOutputList(
        error(configureFlutterOutput.error!!),
        {
          buttonName: 'create-web',
          isDisable: true
        }
      );
      return;
    }

    this.dashboardCommandHandler.updateOutputList(
      info("Enabled web version in flutter."),
      {
        buttonName: 'create-web',
        isDisable: true
      }
    );


    this.dashboardCommandHandler.updateOutputList(
      info("Hurray! Flutter is now installed on your system!!\nNow you may click the \"Create web app button to create a new app!\"")
      , {
        buttonName: 'install-flutter',
        isDisable: true
      });

  }
}
