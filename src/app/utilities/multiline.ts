import { outdentModule } from "@deps";

export function stripIndent(str: TemplateStringsArray, ...args: unknown[]) {
  return outdentModule.outdent(str, ...args);
}
