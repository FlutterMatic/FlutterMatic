import { Output } from './Output';

export function error(msg: string): Output {
  console.error(msg);
  return { success: false, error: msg };
}

export function info(msg: string): Output {
  console.log(msg);
  return { success: true, info: msg };
}
