import { Uri } from "vscode"

export const getDashboardContent = async (styles:Uri) => {
    return `
    <html>
    <link rel="stylesheet" href="${ styles}">
    <body>
    <h1>Dashboard</h1>
    <button id="install-flutter">Install flutter</button>
    <button id="create-web">Create web app</button>
    
    <script>
        //Vscode extension
        const vscode = acquireVsCodeApi();
        
        const installFlutterBtn=document.querySelector('#install-flutter');
        const createWebAppBtn=document.querySelector('#create-web');
        
        //addListener
        installFlutterBtn.addEventListener('click',()=>{
            console.log('dd');
            vscode.postMessage({
                command:'install-flutter'
            });
        });
        
        createWebAppBtn.addEventListener('click',()=>{
            vscode.postMessage({
                command:'create-web-app'
            });
        });
    </script>
    </body>
    </html>
    `;
}
