# i18n unused message finder

This is a little tool to find unused i18n messages in a project. It is currently a work in progress.

All message keys of the given i18nMessageFile will be searched in the given projectFolder. If a message is not found, it will be printed to the console and written to an output file.

The message key will be searched in the following files:

- .ts
- .tsx
- .js
- .jsx
- .html
- .xhtml
- .swift
- .plist
- .m
- .h
- .java

The search is not 100% correct because only the message key is searched as string with surrounding quotes like " and '. So if the message key is used in a variable or function name, it will be found as well.

## Usage

via standalone bundle file:

```bash
i18nUnusedFinder <projectFolder> <i18nMessageFile>
```

or install dependencies:

```bash
bun install
```

and run:

```bash
bun run ../i18n-unused-message-finder/src/index.ts <projectFolder> <i18nMessageFile>
```

## Build bundle file

Standalone bundle file was created with:

```bash
bun build ./src/index.ts --compile --minify --outfile ./bundle/i18nUnusedFinder
```

## Dependencies

- [bun](https://bun.sh), see also [bun license](https://bun.sh/docs/project/licensing)
- [typescript](https://www.typescriptlang.org/)
- [p-limit](https://www.npmjs.com/package/p-limit) v4.0.0 at the moment, we can't use newer versions because buns missing support for async hooks
