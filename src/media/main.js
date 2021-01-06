//Vscode extension
const vscode = acquireVsCodeApi();

const installFlutterBtn = document.querySelector('#install-flutter');
const createWebAppBtn = document.querySelector('#create-web');

//addListener
installFlutterBtn.addEventListener('click', () => {
    console.log('dd');
    vscode.postMessage({
        command: 'install-flutter'
    });
});

createWebAppBtn.addEventListener('click', () => {
    vscode.postMessage({
        command: 'create-web-app'
    });
});