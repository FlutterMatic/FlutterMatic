import {
  commands,
  ExtensionContext,
  Uri,
  ViewColumn,
  WebviewPanel,
  window,
} from "vscode";
import { EXTENSION_ID } from "../constants";
import { Output } from "../Output";

import { DashboardContent } from "../webview/dashboard";
import { InstallFlutterCommand } from "./InstallFlutterCommand";

export class DashboardCommandHandler {
  outputList: Output[] = [];
  webViewPanel: WebviewPanel;
  dashboardContent: DashboardContent;
  constructor(panel: WebviewPanel, styleURI: Uri, scriptURI: Uri) {
    this.webViewPanel = panel;
    this.dashboardContent = new DashboardContent(styleURI, scriptURI);
    this.webViewPanel.webview.html = this.dashboardContent.getDashboardContent(
      this.outputList
    );
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
        switch (message.command) {
          case "install-flutter":
            await new InstallFlutterCommand(dashboardCommandHandler).run();
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
  });
}
