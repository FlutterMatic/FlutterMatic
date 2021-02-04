/**
 * Interface for results of executed shell commands
 * success should be a check for exitcode === 0
 * info : stdout
 * error : stderr
 */
export interface Output {
  info?: string;
  error?: string;
  success: boolean;
}
