/**
 * Typescript to find unused i18n messages in a project folder.
 *
 * Input:
 *  - path to project folder
 *  - path to i18n property file
 *
 * Output:
 *  - list of unused message keys
 *  - result json file
 *
 * Usage of bun script:
 * bun index.ts <path to project folder> <path to i18n property file>
 *
 */
import { MessageReader } from "./MessageReader";
import { MessageSearcher } from "./MessageSearcher";

console.log("Find unused i18n messages in project folder");
console.log("===========================================");

// get optional --clean option from command line
const cleanOptionAvailable = Bun.argv[2] === "--clean";
// get project folder path from command line
const projectFolderPath = cleanOptionAvailable ? Bun.argv[3] : Bun.argv[2];
// get i18n file path from command line
const i18nFilePath = cleanOptionAvailable ? Bun.argv[4] : Bun.argv[3];

console.log("Project folder path: " + projectFolderPath);
console.log("i18n messages file: " + i18nFilePath);
console.log("===========================================");

const startTime = Date.now();
const messagesReader = new MessageReader(i18nFilePath);
const messageKeys = await messagesReader.readMessageKeys();

console.log("Found " + messageKeys.length + " message keys in i18n file");

const messageSearcher = new MessageSearcher(projectFolderPath, messageKeys);
const unusedMessageKeys = await messageSearcher.searchUnusedMessageKeys();
await Bun.write("result.json", JSON.stringify(unusedMessageKeys.sort()));
const duration = Date.now() - startTime;

console.log(
  "Found " + unusedMessageKeys.length + " unused message keys in project folder"
);
console.log("Duration: " + duration + "ms");
console.log("===========================================");
console.log("Unused message keys:");

unusedMessageKeys.forEach((messageKey) => {
  console.log(messageKey);
});
if (unusedMessageKeys.length === 0) {
  console.log("No unused message keys found");
}

// clean message keys in i18n file if clean option is set
if (cleanOptionAvailable && unusedMessageKeys.length > 0) {
  console.log("===========================================");
  const writtenBytes = await messagesReader.cleanMessageKeys(unusedMessageKeys);
  if (writtenBytes !== 0) {
    console.log("Cleaned unused message keys in i18n file");
  }
}

console.log("===========================================");
