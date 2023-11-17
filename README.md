# i18n unused message finder

This is a tool designed to find i18n messages that are defined as properties in a project but are not being used.

All message keys of the given `i18nMessageFile` will be searched in the given `projectFolder`. If a message is not found, it will be printed to the console and added to a json result file.

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

> [!CAUTION]  
> The search is not 100% correct because only the message key is searched as `string` with surrounding quotes like `"` and `'` or with a beginning `.`
> If the message key is used in a concat operation or as a variable, it will not be found.

## Usage

install dependencies:

```bash
bun install
```

and run:

```bash
bun run ./src/index.ts <projectFolder> <i18nMessageFile>
```

## Build a bundle file

Standalone bundle file can be created with:

```bash
bun build ./src/index.ts --compile --minify --outfile ./bundle/i18nUnusedFinder
```

## Dependencies

- [bun](https://bun.sh), see also [bun license](https://bun.sh/docs/project/licensing)
- [typescript](https://www.typescriptlang.org/)
