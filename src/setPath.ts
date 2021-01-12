import { Output } from "./Output";
import { homedir } from "os";
import { join } from "path";
import { exec } from "./runCommand";

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
        return executeCommandAndReturnOutput((`SETX PATH "${join(homedir(), ".flutter-sdktest", "bin")}"`))
    }

    const { shellName } = shell;
    try {
        // Write to the necessary env config file
        switch (shellName) {
            case "ZSH":
                return executeCommandAndReturnOutput("echo -e \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.zshenv");
            case "BASH":
                return executeCommandAndReturnOutput("echo -e \"export PATH=$HOME/.flutter-sdktest/bin:$PATH\" >> ~/.bashrc");
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
