import { commands, ExtensionContext, Uri, ViewColumn, window } from "vscode";
import { EXTENSION_ID } from "../constants";

import { getDashboardContent } from "../webview/dashboard";

export async function dashboardCommand(context: ExtensionContext) {
  return commands.registerCommand(`${EXTENSION_ID}.dashboard`, async () => {
    const panel = window.createWebviewPanel(
      "dashboard",
      "Dashboard",
      ViewColumn.One
    );
    const stylesPath = Uri.joinPath(
      context.extensionUri,
      "src",
      "media",
      "vscode.css"
    );
    const styleURI = panel.webview.asWebviewUri(stylesPath);
    panel.webview.html = await getDashboardContent(styleURI);
  });
}
