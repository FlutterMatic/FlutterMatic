import { homedir } from "os";
import { join } from "path";
import {
  commands,
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from "vscode";
import { EXTENSION_ID } from "../constants";
import { createInstallationDirectory } from "../createDirectory";
import { checkIfFlutterIsInstalled } from "../dependencies/checkForFlutter";
import { checkForGit } from "../dependencies/checkForGit";
import {
  configureFlutter,
  gitClone,
  installFlutter,
} from "../installer/installFlutter";
import { error, info } from "../logger";
import { Output } from "../Output";

import { DashboardContent } from "../webview/dashboard";

class DashboardCommandHandler {
  outputList: Output[] = [];
  webViewPanel: WebviewPanel;
  dashboardContent: DashboardContent;
  constructor(panel: WebviewPanel, styleURI: Uri, scriptURI: Uri) {
    this.webViewPanel = panel;
    this.dashboardContent = new DashboardContent(styleURI, scriptURI);
  }

  updateOutputList(output: Output) {
    this.outputList.push(output);
    this.webViewPanel!!.webview.html = this.dashboardContent.getDashboardContent(
      this.outputList
    );
  }
}
function getScriptURI(context: ExtensionContext, panel: WebviewPanel) {
  const jsScriptPath = Uri.joinPath(
    context.extensionUri,
    "src",
    "media",
    "main.js"
  );
  return panel.webview.asWebviewUri(jsScriptPath);
}
function getStyleURI(context: ExtensionContext, panel: WebviewPanel) {
  const stylesPath = Uri.joinPath(
    context.extensionUri,
    "src",
    "media",
    "vscode.css"
  );
  const styleURI = panel.webview.asWebviewUri(stylesPath);
  return styleURI;
}
export async function dashboardCommand(context: ExtensionContext) {
  return commands.registerCommand(`${EXTENSION_ID}.dashboard`, async () => {
    const panel = window.createWebviewPanel(
      "dashboard",
      "Dashboard",
      ViewColumn.One,
      {
        enableScripts: true,
      }
    );

    panel.webview.onDidReceiveMessage(
      async (message) => {
        // TODO Refactor required
        switch (message.command) {
          case "install-flutter":
            commands.executeCommand(`${EXTENSION_ID}.helloWorld`);
            break;

          case "create-web-app":
            commands.executeCommand(`${EXTENSION_ID}.create-flutter-web-app`);
            break;
        }
      },
      undefined,
      context.subscriptions
    );

    const styleURI = getStyleURI(context, panel);
    const scriptURI = getScriptURI(context, panel);

    const dashboardCommandHandler = new DashboardCommandHandler(
      panel,
      styleURI,
      scriptURI
    );

    dashboardCommandHandler.updateOutputList({
      info: "Starting installation process",
      success: true,
    });

    dashboardCommandHandler.updateOutputList(info("Checking for dependencies"));

    const gitOutput = await checkForGit();
    if (!gitOutput.success) {
      dashboardCommandHandler.updateOutputList(error(gitOutput.error!!));
      return;
    }

    const flutterOutput = await checkIfFlutterIsInstalled();
    if (flutterOutput.success) {
      dashboardCommandHandler.updateOutputList(error(flutterOutput.info!!));
      return;
    }

    dashboardCommandHandler.updateOutputList(
      info(
        "All dependencies present. Proceeding to create installation directory"
      )
    );

    const createInstallationDirectoryOutput = await createInstallationDirectory();
    if (!createInstallationDirectoryOutput.success) {
      dashboardCommandHandler.updateOutputList(
        error(createInstallationDirectoryOutput.error!!)
      );
      return;
    }

    dashboardCommandHandler.updateOutputList(
      info("Installation directory created. Proceeeding to clone the git repo")
    );

    const gitCloneOutput = await gitClone();
    if (!gitCloneOutput.success) {
      dashboardCommandHandler.updateOutputList(error(gitCloneOutput.error!!));
      return;
    }

    dashboardCommandHandler.updateOutputList(
      info(
        "Git Clone successful. Proceeding to installing flutter. This may take a while."
      )
    );

    const installFlutterOutput = await installFlutter();
    if (!installFlutterOutput.success) {
      dashboardCommandHandler.updateOutputList(
        error(installFlutterOutput.error!!)
      );
      return;
    }

    dashboardCommandHandler.updateOutputList(
      info(
        "Flutter installation complete. Proceeding to enable web version in flutter sdk"
      )
    );

    const configureFlutterOutput = await configureFlutter();
    if (!configureFlutterOutput.success) {
      dashboardCommandHandler.updateOutputList(
        error(configureFlutterOutput.error!!)
      );
      return;
    }
    dashboardCommandHandler.updateOutputList(
      info("Hurray! Flutter is now installed on your system!!")
    );

    dashboardCommandHandler.updateOutputList(
      info(
        `1. Copy this: ${join(
          homedir(),
          ".flutter-sdktest",
          "bin",
          "flutter"
        )} create starter_web`
      )
    );
    dashboardCommandHandler.updateOutputList(
      info(
        `2. Copy this (after cd command):
         ${join(homedir(), ".flutter-sdktest", "bin", "flutter")} run`
      )
    );
  });
}
