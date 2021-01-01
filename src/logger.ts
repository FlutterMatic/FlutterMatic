import { window } from "vscode";

export function error(msg: string) {
  console.error(msg);
  window.showErrorMessage(msg);
}

export function info(msg: string) {
  console.log(msg);
  window.showInformationMessage(msg);
}
