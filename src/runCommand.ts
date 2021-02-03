import { exec as execCall } from "child_process";
import { promisify } from "util";

export const exec = promisify(execCall);
