import { MessageReader } from "./MessageReader";
import { expect, test } from "bun:test";

test("must find i18n messages keys", async () => {
  const messagesReader = new MessageReader(
    "./testData/i18n_messages/Localizable.strings"
  );
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
