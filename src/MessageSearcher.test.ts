import { MessageSearcher } from "./MessageSearcher";
import { MessageReader } from "./MessageReader";
import { expect, test } from "bun:test";

test("must find unused message keys", async () => {
  const i18nMessages = new MessageReader(
    "./testData/i18n_messages/Localizable.strings"
  );
  const messages = await i18nMessages.readMessageKeys();
  const searcher = new MessageSearcher(
    "./testData/scenario_simple/projectPath",
    messages
  );
  const unusedMessageKeys = await searcher.searchUnusedMessageKeys();

  expect(unusedMessageKeys.length).toBe(3);
  expect(unusedMessageKeys[0]).toBe("UNUSED_MESSAGE_A");
  expect(unusedMessageKeys[1]).toBe("UNUSED_MESSAGE_B");
  expect(unusedMessageKeys[2]).toBe("UNUSED_MESSAGE_C");
});
