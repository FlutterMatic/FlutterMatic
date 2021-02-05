import { Env, Target, SetOperationType } from 'windows-environment';

import { Output } from "./Output";
import { homedir } from "os";
import { join } from "path";
import { exec } from "./runCommand";

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

export async function setPath(shell: Shell): Promise<Output> {
    // Set $PATH for windows and exit
    if (process.platform === 'win32') {
        const exitCode = 0

/*C:\Users\user\fluttermatic\FlutterMatic>echo %path%
C:\ProgramData\Oracle\Java\javapath;C:\Windows\system32;C:\Windows;C:\Windows\System32\Wbem;C:\Windows\System32\WindowsPowerShell\v1.0\;C:\Windows\System32\OpenSSH\;C:\Program Files\dotnet\;F:\IDE\Go\bin;C:\Program Files\nodejs\;C:\Program Files\PostgreSQL\12\lib;C:\Program Files (x86)\Git\cmd;C:\ProgramData\chocolatey\bin;F:\Anaconda3;F:\Anaconda3\Library\mingw-w64\bin;F:\Anaconda3\Library\usr\bin;F:\Anaconda3\Library\bin;F:\Anaconda3\Scripts;F:\Python 3.7\Scripts\;F:\Python 3.7\;C:\Users\user\AppData\Local\Microsoft\WindowsApps;F:\Python3.7;C:\Program Files\heroku\bin;F:\IDE\Microsoft VS Code\bin;C:\Users\user\go\bin;C:\Users\user\AppData\Roaming\npm;F:\Git\bin\git.exe;C:\Program Files\PostgreSQL\12\lib;C:\Program Files\PostgreSQL\12\bin;C:\Program Files\PostgreSQL\12;F:\Git;F:\IDE\Microsoft VS Code\_;C:\Program Files\MongoDB\Server\4.2\bin;C:\Users\user\.deno\bin;C:\Users\user\AppData\Local\GitHubDesktop\bin;C:\Users\user\Downloads\chromedriver_win32;;C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2020.2.3\bin;*/

        exec(`setx /M path "%path%;${join(homedir(),".flutter-sdktest","bin")}`)

        return (exitCode === 0) ?
            { success: true, info: 'Set path'} :
            { success: false, error: 'Could not set path' };
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
