interface ReadTextFileError {
  isError: true;
  errorType: string;
  errorMessage: string;
  attemptedPath: string;
}

export function getDestinationFilePath(
  filePath: string,
  outputFileExtension: string,
) {
  const segments = filePath.split("/");
  const filePathLessFile = segments.slice(0, segments.length - 1).join("/");
  const fileName = segments[segments.length - 1];
  const fileNameWithoutExtension = fileName.split(".")[0];
  return `${filePathLessFile}/${fileNameWithoutExtension}${outputFileExtension}`;
}

export async function readTextFile(
  absolutePath: string,
): Promise<string | ReadTextFileError> {
  try {
    return await Deno.readTextFile(absolutePath);
  } catch (error) {
    return {
      isError: true,
      errorType: error.name,
      errorMessage: error.message,
      attemptedPath: absolutePath,
    };
  }
}

export function isReadTextFileError(
  value: string | ReadTextFileError,
): value is ReadTextFileError {
  if (typeof value === "string") {
    return false;
  }

  return "isError" in value;
}

export async function writeTextFile(absolutePath: string, content: string) {
  return await Deno.writeTextFile(absolutePath, `${content}\n`);
}
