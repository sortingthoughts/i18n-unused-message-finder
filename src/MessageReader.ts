import { BunFile } from "bun";

/**
 * The MessageReader class searches for all message keys in given i18n property file.
 * The following formats are supported:
 * - key=value;
 * - key = value;
 * - key=value
 * - key = value
 * - key="value"
 */
export class MessageReader {
  private readonly _filePath: string;

  /**
   * The constructor of the I18nMessages class which searches
   * for all message keys in given i18n file.
   * @param filePath the path of the i18n file
   */
  constructor(filePath: string) {
    if (!filePath) {
      throw new Error("filePath is required");
    }
    this._filePath = filePath;
  }

  /**
   * Collects all message keys from given path.
   * @returns the message keys
   */
  public async readMessageKeys(): Promise<string[]> {
    return await this.searchMessageKeys();
  }

  /**
   * Search for all message keys in given path.
   *
   * @returns a list of message keys
   */
  private async searchMessageKeys(): Promise<string[]> {
    const messageKeys: string[] = [];

    // check if filePath exists
    const fileContentLines = await this.readFileContentLines();

    // iterate over each line
    fileContentLines.forEach((line) => {
      // check if line contains a message key
      if (this.isMessageKey(line)) {
        // get the message key from line
        // and add message key to list
        messageKeys.push(this.getMessageKey(line));
      }
    });

    return messageKeys;
  }

  /**
   * Reads the file content and returns the lines of the file.
   * @returns lines of the file
   */
  private async readFileContentLines() {
    const messageFile: BunFile = Bun.file(this._filePath);
    const fileExist = messageFile.exists;
    if (!fileExist) {
      throw new Error("Message file does not exist: " + this._filePath);
    }

    // read file content
    const fileContent = await messageFile.text();
    const fileContentLines = fileContent.split("\n");
    return fileContentLines;
  }

  /**
   * Checks if the given line contains a message key. Supports the following formats:
   * - key=value;
   * - key = value;
   * - key=value
   * - key = value
   * - key="value"
   *
   * @param line the line to check
   * @returns true if line contains a message key
   */
  private isMessageKey(line: string): boolean {
    // line is not a comment line which starts with '//' or '#' or '/*' or '*/' or empty line
    if (
      line.startsWith("//") ||
      line.startsWith("#") ||
      line.startsWith("/*") ||
      line.startsWith("*/") ||
      line.trim().length == 0
    ) {
      return false;
    }

    // check if line contains a message key
    if (line.indexOf("=") > -1) {
      return true;
    }

    return false;
  }

  /**
   * Gets the message key from the given line.
   * Line must contain a message key.
   *
   * @param line the line to get the message key from
   * @returns the message key
   */
  private getMessageKey(line: string): string {
    return line.substring(0, line.indexOf("=")).trim();
  }

  /**
   * Removes the given message keys from the i18n file.
   * Load the existing i18n file and remove the given message key.
   * Then write the cleaned i18n file.
   * @param unusedMessageKeys the message keys to remove
   * @returns the number written bytes
   */
  public async cleanMessageKeys(unusedMessageKeys: string[]): Promise<number> {
    const fileContentLines = await this.readFileContentLines();
    const cleanedContentLines: string[] = [];

    // iterate over each line
    for (const line of fileContentLines) {
      // check if line contains a message key
      if (this.isMessageKey(line)) {
        // get the message key from line
        const messageKey = this.getMessageKey(line);
        // check if message key is not in unused message keys
        if (!unusedMessageKeys.includes(messageKey)) {
          // add line to cleaned content lines
          cleanedContentLines.push(line);
        }
      } else {
        // add line to cleaned content lines
        cleanedContentLines.push(line);
      }
    }

    return await Bun.write(this._filePath, cleanedContentLines.join("\n"));
  }
}
