import { Output } from './Output';

import { mkdir as mkdirCall } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { homedir } from 'os';

const mkdir = promisify(mkdirCall);

export async function createInstallationDirectory(): Promise<Output> {
  try {
    await mkdir(join(homedir(), '.flutter-sdktest'));
    return { success: true, info: 'Installation directory created' };
  } catch (e: any) {
    return {
      success: false,
      error: `Error creating installation directory\n${e.message}`,
    };
  }
}
