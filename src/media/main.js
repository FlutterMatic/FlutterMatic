function main() {
  const vscode = acquireVsCodeApi();

  const installFlutterBtn = document.getElementById("install-flutter");
  const createWebAppBtn = document.getElementById("create-web");

  installFlutterBtn.addEventListener("click", () => {
    vscode.postMessage({
      command: "install-flutter",
    });
  });

  createWebAppBtn.addEventListener("click", () => {
    vscode.postMessage({
      command: "create-web-app",
    });
  });
}

main();
