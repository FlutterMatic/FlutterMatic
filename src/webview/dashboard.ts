import { Uri } from "vscode";
import { Output } from "../Output";

export class DashboardContent {
  styleUri: Uri;
  scriptUri: Uri;
  options: { flutter: boolean };

  constructor(styleUri: Uri, scriptUri: Uri, options: { flutter: boolean }) {
    this.styleUri = styleUri;
    this.scriptUri = scriptUri;
    this.options = options;
  }

  updateOptions(options: { flutter: boolean }) {
    this.options = options;
  }

  getDashboardContent(outputs: Output[]) {
    console.log(this.options)
    return `
    <html>
      <head>
        <link rel="stylesheet" href="${this.styleUri}"
        <meta http-equiv="Content-Security-Policy" content="default-src self; img-src vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline'; "/>
      </head>
      <h1>Dashboard</h1>

        <button ${this.options.flutter ? 'disabled' : ""} id="install-flutter">Install Flutter</button>

        <button ${this.options.flutter ? '' : "disabled"} id="create-web">Create web app</button>
    ${outputs
        .map((output) => {
          return `<b>${output.success ? "Success" : "Error"}</b><p>${output.success ? output.info!! : output.error!!
            }</p>`;
        })
        .join("")}
    <script src="${this.scriptUri}" defer></script>
    </html>
    `;
  }
}
