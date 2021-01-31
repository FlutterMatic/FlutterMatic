import { CancellationToken, commands, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext } from "vscode";
import {CreateFlutterWebProjectCommand} from "./commands/CreateFlutterWebProjectCommand";
import {DashboardCommandHandler} from "./commands/DashboardCommand";
import {InstallFlutterCommand} from "./commands/InstallFlutterCommand";
import { EXTENSION_ID } from "./constants";
import {checkIfFlutterIsInstalled} from "./dependencies/checkForFlutter";
import {Output} from "./Output";
import {DashboardContent, DashboardContentOptions} from "./webview/dashboard";

function getScriptURI(webview:Webview,extensionUri:Uri){
    return webview.asWebviewUri(Uri.joinPath(extensionUri,"media","main.js"))
}
function getStyleURI(webview:Webview,extensionUri:Uri){
    return webview.asWebviewUri(Uri.joinPath(extensionUri,"media","vscode.css"))
}

export class SideBarProvider implements WebviewViewProvider {
    public static readonly viewType = "fluttermatic.side";
    private outputList:Output[] = [];
    private options:DashboardContentOptions;
    private readonly extensionUri

     constructor(
        private readonly _extensionUri: Uri) { 
         this.extensionUri=_extensionUri
         this.options  = {flutter:false,isFlutterInstalling:false}
    }

    public resolveWebviewView(webviewView: WebviewView,
        _context: WebviewViewResolveContext,
        _token: CancellationToken) {

         
            const {webview}=webviewView
        const dashboardCommandHandler = new DashboardCommandHandler(

            webviewView.webview,getStyleURI(webview,this.extensionUri ),getScriptURI(webview,this.extensionUri),this.options)
        

            webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

     //   webviewView.webview.html = this._getHTML(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async message => {
        switch (message.command) {
          case "install-flutter":
            await new InstallFlutterCommand(dashboardCommandHandler).run();
            break;

          case "create-web-app":
            await new CreateFlutterWebProjectCommand(
              dashboardCommandHandler
            ).run();
            break;
        }

        });

    }

    private _getHTML(webview: Webview) {
        const styleUri = webview.asWebviewUri(
            Uri.joinPath(
                this._extensionUri,
                "media",
                "vscode.css"));

        const scriptUri = webview.asWebviewUri(
            Uri.joinPath(
                this._extensionUri,
                "media",
                "side.js"));

        return `
            <html>
            <head>
            <link rel="stylesheet" href="${styleUri}"/>
            <meta http-equiv="content-security-policy" content="default-src self; img-src vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline'; "/>
            </head>

            <h1>Flutter Matic</h1>
            <button id="dashboard-btn">Proceed to Install</button>

            <script src="${scriptUri}" defer></script>

            </html>`;

    }

}

