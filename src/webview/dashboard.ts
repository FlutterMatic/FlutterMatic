import { Uri } from "vscode";
import { ButtonState, Output } from "../Output";

export class DashboardContent {
  styleUri: Uri;
  scriptUri: Uri;

  constructor(styleUri: Uri, scriptUri: Uri) {
    this.styleUri = styleUri;
    this.scriptUri = scriptUri;
  }

  getDashboardContent(outputs: Output[], buttonState: ButtonState) {
    return `
    <html>
      <head>
        <link rel="stylesheet" href="${this.styleUri}"
        <meta http-equiv="Content-Security-Policy" content="default-src self; img-src vscode-resource:; script-src vscode-resource: 'self' 'unsafe-inline'; style-src vscode-resource: 'self' 'unsafe-inline'; "/>
      </head>
      <h1>Dashboard</h1>
      <button id="install-flutter">Install flutter</button>
      <button id="create-web">Create web app</button>
    ${outputs
        .map((output) => {
          return `<b>${output.success ? "Success" : "Error"}</b><p>${output.success ? output.info!! : output.error!!
            }</p>`;
        })
        .join("")}
    <script defer>
        const installFlutterBtn = document.getElementById("install-flutter");
        const createWebAppBtn = document.getElementById("create-web");
        switch ('${buttonState.buttonName}') {
          case 'install-flutter':
            if('${buttonState.isDisable}'=='true'){
              installFlutterBtn.setAttribute('disabled', 'disabled')
              createWebAppBtn.removeAttribute('disabled');
            }
            else {
              installFlutterBtn.removeAttribute('disabled');
              createWebAppBtn.setAttribute('disabled', 'disabled');
            }
            break;
          case 'create-web':
            if('${buttonState.isDisable}'=='true'){
              createWebAppBtn.setAttribute('disabled', 'disabled');
              installFlutterBtn.removeAttribute('disabled');
            }else {
              createWebAppBtn.removeAttribute('disabled');
              installFlutterBtn.setAttribute('disabled', 'disabled');
            }
            break;
          default:
            break;
        }
    </script>
    <script src="${this.scriptUri}" defer></script>
    </html>
    `;
  }
}
