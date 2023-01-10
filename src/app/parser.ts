// Parses each VM command into its lexical elements

const arithmeticOrLogicalCommands = [
  "add",
  "sub",
  "neg",
  "eq",
  "gt",
  "lt",
  "and",
  "or",
  "not",
] as const;
type ArithmeticOrLogicalCommand = typeof arithmeticOrLogicalCommands[number];
const commands = ["push", "pop", ...arithmeticOrLogicalCommands] as const;
type Command = typeof commands[number];

const segments = [
  "local",
  "argument",
  "this",
  "that",
  "constant",
  "static",
  "pointer",
  "temp",
] as const;
type Segment = typeof segments[number];

type PushOrPopCommandResult = {
  command: "push" | "pop";
  segment: Segment;
  value: number;
};

type ArithmeticOrLogicalCommandResult = {
  command: ArithmeticOrLogicalCommand;
};

export function parse(
  lineCommand: string,
): PushOrPopCommandResult | ArithmeticOrLogicalCommandResult {
  const words = lineCommand.split(" ");
  const command = words[0];

  if (!isAValidCommand(command)) {
    throw new Error(`Command not implemented, '${command}'`);
  }

  if (command === "push") {
    const segment = words[1];
    const value = words[2];

    if (!isAValidSegment(segment)) {
      throw new Error(`Not a valid segment, ${segment}`);
    }

    return {
      command: "push",
      segment,
      value: parseInt(value),
    };
  }

  if (command === "pop") {
    const segment = words[1];
    const value = words[2];

    if (!isAValidSegment(segment)) {
      throw new Error(`Not a valid segment, ${segment}`);
    }

    return {
      command: "pop",
      segment,
      value: parseInt(value),
    };
  }

  if (isAValidArithmeticOrLogicalCommand(command)) {
    return {
      command,
    };
  }

  throw new Error("Something went wrong");
}

function isAValidCommand(command: string): command is Command {
  return commands.includes(command as Command);
}

function isAValidArithmeticOrLogicalCommand(
  command: string,
): command is ArithmeticOrLogicalCommand {
  return arithmeticOrLogicalCommands.includes(
    command as ArithmeticOrLogicalCommand,
  );
}

function isAValidSegment(segment: string): segment is Segment {
  return segments.includes(segment as Segment);
}
