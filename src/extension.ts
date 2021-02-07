import * as vscode from 'vscode';

import { DashboardProvider } from './webview/dashboard/DashboardWebviewProvider';

export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DashboardProvider.viewType,
      new DashboardProvider(context)
    )
  );
}

export function deactivate() {}
