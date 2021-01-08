import * as vscode from "vscode";

import { dashboardCommand } from "./commands/DashboardCommand";

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(await dashboardCommand(context));
}

export function deactivate() {}
