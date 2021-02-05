import { CancellationToken, ExtensionContext, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext } from "vscode";
import { CreateFlutterWebProjectCommand } from "../../commands/CreateFlutterWebProjectCommand";
import { DashboardCommandHandler } from "./DashboardCommandHandler";
import { InstallFlutterCommand } from "../../commands/InstallFlutterCommand";
import { DashboardContentOptions } from "./DashboardContentOptions";
import { join } from "path";
import { exec } from "../../runCommand";
import {
  CancellationToken,
  Uri,
  Webview,
  WebviewView,
  WebviewViewProvider,
  WebviewViewResolveContext,
} from 'vscode';

function getScriptURI(webview: Webview, extensionUri: Uri) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'main.js'));
}

function getStyleURI(webview: Webview, extensionUri: Uri) {
  return webview.asWebviewUri(Uri.joinPath(extensionUri, 'media', 'vscode.css'));
}

export class DashboardProvider implements WebviewViewProvider {
    public static readonly viewType = "fluttermatic.side";
    private options: DashboardContentOptions;
    private readonly extensionUri;
    private readonly extensionContext;

    constructor(
        _extensionContext: ExtensionContext
        ) {
        this.extensionUri = _extensionContext.extensionUri;
        this.extensionContext = _extensionContext;
        this.options = { flutter: false, isFlutterInstalling: false };
    }

    public resolveWebviewView(webviewView: WebviewView,
        _context: WebviewViewResolveContext,
        _token: CancellationToken) {

        const { webview } = webviewView;
        const dashboardCommandHandler = new DashboardCommandHandler(
            webviewView.webview,
            getStyleURI(webview, this.extensionUri),
            getScriptURI(webview, this.extensionUri),
            this.options);
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.extensionUri
            ]
        };

        webviewView.webview.onDidReceiveMessage(async message => {
            switch (message.command) {
                case "install-flutter":
                    await new InstallFlutterCommand(dashboardCommandHandler,this.extensionContext).run();
                    setTimeout(() => dashboardCommandHandler.clearWebView(), 1500);
                    break;

                case "create-web-app":
                    await new CreateFlutterWebProjectCommand(dashboardCommandHandler).run();
                    setTimeout(() => dashboardCommandHandler.clearWebView(), 1500);
                    break;
            }

        });

    }

  }
