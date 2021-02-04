function main() {
  const vscode = acquireVsCodeApi();

  const dashboardBtn = document.getElementById('dashboard-btn');

  dashboardBtn.addEventListener('click', () => {
    vscode.postMessage({
      command: 'dashboard',
    });
  });
}

main();
