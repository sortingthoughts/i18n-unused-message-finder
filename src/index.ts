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

// get project folder path from command line
const projectFolderPath = process.argv[2];
// get i18n folder path from command line
const i18nFolderPath = process.argv[3];

console.log("Project folder path: " + projectFolderPath);
console.log("i18n messages file: " + i18nFolderPath);
console.log("===========================================");

const startTime = Date.now();
const messagesReader = new MessageReader(i18nFolderPath);
const messageKeys = await messagesReader.readMessageKeys();

console.log("Found " + messageKeys.length + " message keys in i18n file");

const messageSearcher = new MessageSearcher(projectFolderPath, messageKeys);
const unusedMessageKeys = await messageSearcher.searchUnusedMessageKeys();
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

console.log("===========================================");
