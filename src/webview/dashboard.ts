import { Uri } from "vscode";
import { Output } from "../Output";

export class DashboardContent {
  styleUri: Uri;
  scriptUri: Uri;

  constructor(styleUri: Uri,scriptUri:Uri) {
    this.styleUri = styleUri;
    this.scriptUri = scriptUri
  }

  getDashboardContent(outputs: Output[]) {
    console.log(outputs);

    console.log(
      outputs.map((output) => {
        return `<p>${output.success ? "Success" : "Error"}</p>`;
      })
    );

    return `
    <html>
    <link rel="stylesheet" href="${this.styleUri}"
    <script src="${this.scriptUri}" />
    <h1>Dashboard</h1>
    <button id="install-flutter">Install flutter</button>
    <button id="create-web">Create web app</button>
	${outputs
    .map((output) => {
      return `<b>${output.success ? "Success" : "Error"}</b><p>${
        output.success ? output.info!! : output.error!!
      }</p>`;
    })
    .join("")}
    </html>
    `;
  }
}
