import { Uri } from 'vscode';

export const getDashboardContent = async (styles: Uri, script: Uri) => {
    return `
    <html>
    <link rel="stylesheet" href="${styles}">
    <body>
    <h1>Dashboard</h1>
    <button id="install-flutter">Install flutter</button>
    <button id="create-web">Create web app</button>
    
    <script src="${script}"></script>
    </body>
    </html>
    `;
};
