import * as vscode from "vscode";

import { dashboardCommand } from "./commands/DashboardCommand";
import { SideBarProvider } from "./sideBarWv";

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(await dashboardCommand(context));
  context.subscriptions.push(vscode.window.registerWebviewViewProvider(SideBarProvider.viewType,
    new SideBarProvider(context.extensionUri)));
}

export function deactivate() { }
