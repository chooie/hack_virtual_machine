import { path } from "@deps";

const currentFileDirectory = path.dirname(path.fromFileUrl(import.meta.url));

export const REPO_ROOT = currentFileDirectory.replace(
  // WARNING: if we move any of the directories, this needs to be updated
  "/src/app",
  "",
);
export const APP_ROOT = currentFileDirectory;
