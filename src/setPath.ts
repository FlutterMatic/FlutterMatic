import { Output } from "./Output";
import { exec } from "./runCommand";

export interface Shell {
    shellName: "BASH" | "FISH" | "ZSH" | ""
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

export async function setPath(shell: Shell): Promise<Output> {
    const { shellName } = shell;
    try {
        switch (shellName) {
            case "FISH":
                return executeCommandAndReturnOutput("set -u fish_user_paths $HOME/.flutter-sdktest $fish_user_paths");
            case "ZSH":
                return executeCommandAndReturnOutput("echo -e \"export PATH=$HOME/.flutter-sdktest:$PATH\" >> ~/.zshenv");
            case "BASH":
                return executeCommandAndReturnOutput("echo -e \"export PATH=$HOME/.flutter-sdktest:$PATH\" >> ~/.bashrc");
            default:
                return { error: `Could not set the path for ${shellName}`, success: false };
        }
    } catch (e: any) {
        return { error: `Could not set the path for ${shellName}`, success: false };
    }
}

export async function executeCommandAndReturnOutput(command: string): Promise<Output> {
    const fishSetPathOutput = await exec(command);
    if (fishSetPathOutput.stdout) {
        console.log(fishSetPathOutput.stdout);
        
        return { info: "Set path", success: true };
    }
    console.log(fishSetPathOutput.stderr);
    
    return { error: fishSetPathOutput.stderr, success: false };
}
