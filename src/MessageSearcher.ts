import * as fs from "fs";

/**
 * The MessageSearcher class is used to search for unused message keys in multiple folders.
 * In all folders it will be only searched for files with the listed file extensions of the
 * includeFileExtensions property.
 */
export class MessageSearcher {
  private readonly folderPath: string;
  private readonly messageKeys: string[];
  private foundMessageKeys: string[]; // only for testing

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

    this.foundMessageKeys = [];
    this.folderPath = folderPath;
    this.messageKeys = messageKeys;
  }

  /**
   * Search for unused message keys in the given folder.
   *
   * @returns a list of unused message keys
   */
  public async searchUnusedMessageKeys(): Promise<string[]> {
    const files = this.getFilesOfFolder(this.folderPath);
    console.log("Checking " + files.length + " files in project folder...");

    let keys = new Set(this.messageKeys);

    const searchInFile = async (filePath: string) => {
      // read the file content
      const fileContent = await Bun.file(filePath).text();

      // check if message key is used in file
      keys = new Set(
        [...keys].filter((key) => {
          const escapedKey = this.escapeRegExp(key);
          // the key must be surrounded by double quotes
          // or single quotes
          // or a beginning dot
          const pattern = new RegExp(
            `"${escapedKey}"|'${escapedKey}'|\\.${escapedKey}`
          );
          const findKey = pattern.test(fileContent);
          if (findKey) {
            this.foundMessageKeys.push(key);
          }
          return !findKey;
        })
      );
    };

    await Promise.all(files.map((filePath) => searchInFile(filePath)));
    return Array.from(keys);
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
   * Escapes the given string for usage in a regular expression.
   * @param str the string to escape
   * @returns the escaped string
   */
  private escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  /**
   * Checks if the given file name has one of an allowed file extensions.
   * @param name the file name
   * @returns true if the file name has one of the allowed file extensions
   */
  private hasIncludeFileExtension(name: string): boolean {
    return this.includeFileExtensions.some((ext) => name.endsWith(ext));
  }

  /**
   * Gets the found message keys, only for testing.
   * @returns found message keys
   */
  public getFoundMessageKeys(): string[] {
    return this.foundMessageKeys;
  }
}
