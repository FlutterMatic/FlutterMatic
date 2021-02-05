import { Output } from "./Output";
import { join } from "path";
import { exec } from "./runCommand";
import { ExtensionContext } from 'vscode';

// Commands for setting path
const bashrcCommand = "echo \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.bashrc ; export PATH=$HOME/.flutter-sdktest/bin/:$PATH";
const zshenvCommand = "echo \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.zshenv ; export PATH=$HOME/.flutter-sdktest/bin/:$PATH";
const bashProfileCommand = "echo \"PATH=$HOME/.flutter-sdktest/bin/:$PATH\" >> ~/.bash_profile ; source $HOME/.bash_profile";
const fishPathCommand = "echo \"set PATH $HOME/.flutter-sdktest/bin/ $PATH\" >> ~/.config/fish/config.fish";

export interface Shell {
    shellName: "BASH" | "ZSH" | "" | "FISH"
}

export async function getShell(): Promise<Shell> {
    try {
        const shellName = (await exec('echo $SHELL')).stdout;
        if (shellName.includes("bash")) {
            return { shellName: "BASH" };
        }
        if (shellName.includes("zsh")) {
            return { shellName: "ZSH" };
        }
        if (shellName.includes("fish")) {
            return { shellName: "FISH" };
        }

        return { shellName: "" };

    } catch (e: any) {
        return { shellName: "" };
    }
}

export async function setPath(shell: Shell,ec:ExtensionContext): Promise<Output> {
    // Set $PATH for windows and exit
    if (process.platform === 'win32') {
        const templatevbs = ec.asAbsolutePath(join("media","path.vbs"));
        await exec(templatevbs);
        return {success:true,info:"Set Path"};
    }

    const { shellName } = shell;

    // Workaround to write to bash_profile on MacOS
    if (process.platform === "darwin" && shellName === "BASH") {
        return executeCommandAndReturnOutput(bashProfileCommand);
    }

    // Linux and MacOS (Other Shell(s))
    try {
        // Write to the necessary env config file and export right now 
        switch (shellName) {
            case "ZSH":
                return executeCommandAndReturnOutput(zshenvCommand);
            case "BASH":
                return executeCommandAndReturnOutput(bashrcCommand);
            case "FISH":
                return executeCommandAndReturnOutput(fishPathCommand);
            default:
                return { error: `Could not set the path for ${shellName}`, success: false };
        }
    } catch (e: any) {
        return { error: `Could not set the path for ${shellName}`, success: false };
    }
}

export async function executeCommandAndReturnOutput(command: string): Promise<Output> {
    await exec(command);

    return { info: "Set path", success: true };
}
