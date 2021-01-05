import { commands, ExtensionContext, Uri, ViewColumn, window} from "vscode";
import { EXTENSION_ID } from "../constants";

import { getDashboardContent } from "../webview/dashboard";

export async function dashboardCommand(context: ExtensionContext) {
  return commands.registerCommand(`${EXTENSION_ID}.dashboard`, async () => {
    const panel = window.createWebviewPanel(
      "dashboard",
      "Dashboard",
      ViewColumn.One,
      {
        enableScripts: true
      }
    );


    const stylesPath = Uri.joinPath(
      context.extensionUri,
      "src",
      "media",
      "vscode.css"
    );

      panel.webview.onDidReceiveMessage(async (message)=>{
        switch(message.command){
          case 'install-flutter':
            commands.executeCommand(`${EXTENSION_ID}.helloWorld`);
            break;
            
            case 'create-web-app':
              commands.executeCommand(`${EXTENSION_ID}.create-flutter-web-app`);
              break;
        }
      },undefined,context.subscriptions);

    const styleURI = panel.webview.asWebviewUri(stylesPath);
    panel.webview.html = await getDashboardContent(styleURI);
  });
}
