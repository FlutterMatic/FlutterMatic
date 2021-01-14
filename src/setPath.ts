import { Output } from "./Output";
import { homedir } from "os";
import { join } from "path";
import { exec } from "./runCommand";

// Commands for setting path
const bashrcCommand = "echo -e \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.bashrc ; export PATH=$HOME/.flutter-sdktest/bin/:$PATH";
const zshenvCOmmand = "echo -e \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.zshenv ; export PATH=$HOME/.flutter-sdktest/bin/:$PATH";
const bashProfileCommand = "echo -e \"PATH=$HOME/.flutter-sdktest/bin/:$PATH\" >> ~/.bash_profile ; export PATH=$HOME/.flutter-sdktest/bin/:$PATH";

export interface Shell {
    shellName: "BASH" | "ZSH" | ""
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

        return { shellName: "" };

    } catch (e: any) {
        return { shellName: "" };
    }
}

export async function setPath(shell: Shell): Promise<Output> {
    // Set $PATH for windows and exit
    if (process.platform === 'win32') {
        return executeCommandAndReturnOutput((`SETX PATH "%PATH%;${join(homedir(), '.flutter-sdktest', 'bin')}"`));
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
                return executeCommandAndReturnOutput(zshenvCOmmand);
            case "BASH":
                return executeCommandAndReturnOutput(bashrcCommand);
            default:
                return { error: `Could not set the path for ${shellName}`, success: false };
        }
    } catch (e: any) {
        return { error: `Could not set the path for ${shellName}`, success: false };
    }
}

export async function executeCommandAndReturnOutput(command: string): Promise<Output> {
    const commandOutput = await exec(command);
    if (commandOutput.stdout) {
        return { info: "Set path", success: true };
    }

    return { error: commandOutput.stderr, success: false };
}
