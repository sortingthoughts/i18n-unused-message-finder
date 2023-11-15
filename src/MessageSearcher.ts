import * as fs from "fs";
import pLimit from "p-limit";

/**
 * The MessageSearcher class is used to search for unused message keys in multiple project.
 * Each project is represented by the first sub folder of the given folder path.
 * All project folders are searched for files with the listed file extensions of the
 * includeFileExtensions property.
 *
 * The Message key is searched only by the key name in a case sensitive way.
 * The key must be surrounded by double quotes which represents the start and end of the key.
 */
export class MessageSearcher {
  private readonly outputFileName = "result.json";
  private readonly keyPatternDoubleQuotes: string = '"MSG_KEY"';
  private readonly keyPatternSingleQuotes: string = "'MSG_KEY'";
  private readonly folderPath: string;
  private readonly messageKeys: string[];
  private readonly limit = pLimit(100); // limit the number of concurrent executions for search in files

  private readonly includeFileExtensions: string[] = [
    ".swift",
    ".java",
    ".h",
    ".m",
    ".plist",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".html",
    ".xhtml",
  ];

  /**
   * Constructor of the MessageSearcher class.
   *
   * @param folderPath the folder path to search for unused message keys
   * @param messageKeys the message keys to search for
   */
  constructor(folderPath: string, messageKeys: string[]) {
    if (!folderPath) {
      throw new Error("folderPath is required");
    }
    if (!messageKeys) {
      throw new Error("messageKeys are required");
    }

    this.folderPath = folderPath;
    this.messageKeys = messageKeys;
  }

  /**
   * Search for unused message keys in the given project folder.
   *
   * @returns a list of unused message keys
   */
  public async searchUnusedMessageKeys(): Promise<string[]> {
    const files = this.getFilesOfFolder(this.folderPath);
    console.log("Check " + files.length + " files in project folder");

    const searchInFile = async (filePath: string, key: string) => {
      // read the file content
      const fileContent = await Bun.file(filePath).text();
      const doubleQuotes: string = this.keyPatternDoubleQuotes.replace(
        "MSG_KEY",
        key
      );
      const singleQuotes = this.keyPatternSingleQuotes.replace("MSG_KEY", key);

      // check if message key is used in file
      return (
        fileContent.includes(doubleQuotes) || fileContent.includes(singleQuotes)
      );
    };

    const searchMessageKeyInFiles = async (
      files: string[],
      messageKey: string
    ) => {
      const searchPromises = files.map((filePath) =>
        this.limit(() => searchInFile(filePath, messageKey))
      );
      const searchResults = await Promise.all(searchPromises);

      // check if message key is used in any file
      return searchResults.includes(true);
    };

    const result: string[] = [];

    for (const messageKey of this.messageKeys) {
      const isUsed = await searchMessageKeyInFiles(files, messageKey);
      if (!isUsed) {
        result.push(messageKey);
      }
    }

    // write the result to file
    await Bun.write(this.outputFileName, JSON.stringify(result));

    return result.sort();
  }

  /**
   * Get all allowed file paths of the given folder.
   *
   * @param folderPath the path to search for files
   * @returns a list of file paths in the given folder
   */
  private getFilesOfFolder(folderPath: string): string[] {
    let files: string[] = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter(
        (item) => item.isFile() && this.hasIncludeFileExtension(item.name)
      )
      .map((item) => folderPath + "/" + item.name);

    // check sub folders
    const subDir: string[] = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((item) => item.isDirectory())
      .map((item) => folderPath + "/" + item.name);

    if (subDir.length > 0) {
      subDir.forEach((dir) => {
        files = files.concat(this.getFilesOfFolder(dir)); // recursive call
      });
    }

    return files;
  }

  /**
   * Checks if the given file name has one of an allowed file extensions.
   * @param name the file name
   * @returns true if the file name has one of the allowed file extensions
   */
  private hasIncludeFileExtension(name: string): boolean {
    return this.includeFileExtensions.some((ext) => name.endsWith(ext));
  }
}
