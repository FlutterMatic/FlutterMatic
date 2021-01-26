import { CancellationToken, commands, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext } from "vscode";
import { EXTENSION_ID } from "./constants";

export class SideBarProvider implements WebviewViewProvider {
    public static readonly viewType = "fluttermatic.side";


    constructor(
        private readonly _extensionUri: Uri) { }

    public resolveWebviewView(webviewView: WebviewView,
        _context: WebviewViewResolveContext,
        _token: CancellationToken) {

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHTML(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async _msg => {
            await commands.executeCommand(`${EXTENSION_ID}.dashboard`);

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

