import { MessageReader } from "./MessageReader";
import { expect, test } from "bun:test";
import { unlink } from "node:fs/promises";

const i18nFilePath = "./testData/i18n_messages/Localizable.strings";
const i18nCopyFilePath = "./testData/i18n_messages/LocalizableCopy.strings";

test("must find i18n messages keys", async () => {
  const messagesReader = new MessageReader(i18nFilePath);
  const messageKeys = await messagesReader.readMessageKeys();
  expect(messageKeys.length).toBe(9);
  expect(messageKeys[0]).toBe("USED_MESSAGE_D");
  expect(messageKeys[1]).toBe("USED_MESSAGE_A");
  expect(messageKeys[2]).toBe("USED_MESSAGE_B");
  expect(messageKeys[3]).toBe("USED_MESSAGE_C");
  expect(messageKeys[4]).toBe("USED_MESSAGE_E");
  expect(messageKeys[5]).toBe("USED_MESSAGE_F");

  expect(messageKeys[6]).toBe("UNUSED_MESSAGE_A");
  expect(messageKeys[7]).toBe("UNUSED_MESSAGE_B");
  expect(messageKeys[8]).toBe("UNUSED_MESSAGE_C");
});

test("must clean unused i18n messages keys", async () => {
  // copy test data to temp file
  const orgFile = await Bun.file(i18nFilePath);
  await Bun.write(i18nCopyFilePath, orgFile);

  const messagesReader = new MessageReader(i18nCopyFilePath);
  const writtenBytes = await messagesReader.cleanMessageKeys([
    "UNUSED_MESSAGE_A",
    "UNUSED_MESSAGE_B",
    "UNUSED_MESSAGE_C",
  ]);
  // check if bytes are written
  expect(writtenBytes).toBeGreaterThan(0);

  // check if unused message keys are removed
  const cleanedFileContent = await Bun.file(i18nCopyFilePath).text();
  expect(cleanedFileContent.includes("UNUSED_MESSAGE_A")).toBeFalse();
  expect(cleanedFileContent.includes("UNUSED_MESSAGE_B")).toBeFalse();
  expect(cleanedFileContent.includes("UNUSED_MESSAGE_C")).toBeFalse();

  // remove temp file
  await unlink(i18nCopyFilePath);
});
