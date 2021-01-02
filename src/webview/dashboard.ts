import { Uri } from "vscode"

export const getDashboardContent = async (styles:Uri) => {
    return `
    <html>
    <link rel="stylesheet" href="${ styles}"
    <h1>Dashboard</h1>
    <button id="install-flutter">Install flutter</button>
    <button id="create-web">Create web app</button>
    </html>
    `
}