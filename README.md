# Copy Reference Advanced

Copy selected line number(s) with absolute/relative file path

e.g. `path/to/file.txt:1-10`

## Hints

<!-- @watch package.json 47-52 -->
- Line numbers start with 1 by default (see Configuration to change this)

## Features

Just what the description says: copy line numbers with absolute/relative file path

<!-- @watch package.json 40-43 -->
Use `ctrl+shift+c` to copy the file path & selected line numbers  

or
<!-- @watch package.json 34-37 -->
use the command palette search for `CopyReference Advanced`

## Configuration

<!-- @watch package.json 48-52 -->
- `copyReferenceAdvanced.lineOffset` The line number to start with (this is added to the zero-based value of the line number)

<!-- @watch package.json 53-57 -->
- `copyReferenceAdvanced.pathLineNumberDelimiter` The delimiter for the path and line number section e.g. `-` would give `some/path.txt`**-**`1-5`, `:` would give `some/path.txt`**:**`1-5`

<!-- @watch package.json 58-62 -->
- `copyReferenceAdvanced.lineNumberDelimiter` The delimiter for the line numbers e.g. `--` would give `1--5`

<!-- @watch package.json 63-67 -->
- `copyReferenceAdvanced.collapseSingleLineNumbers` True: when only one line was selected e.g. 16 the output will be 16 without the line number delimiter, false: the output will always include the line number delimiter

<!-- @watch package.json 68-72 -->
- `copyReferenceAdvanced.prependToPath` Some string to prepend to the file path

<!-- @watch package.json 73-77 -->
- `copyReferenceAdvanced.appendToPath` Some string to append to the file path

<!-- @watch package.json 78-87 -->
- `copyReferenceAdvanced.pathMode` : `absolutePaths` will copy absolute file paths, `relativePaths` will copy relative file paths if the file is inside a opened workspace folder, `relativePathsWithoutFolderName` the same as `relativePaths` but the folder name is removed

<!-- @watch package.json 88-92 -->
- `copyReferenceAdvanced.failIfNoFolderIsOpen` If `pathMode` is set to relative and no folder is open... True: notify warning because we cannot get a relative path (noting is copied), false: just copy the absolute path

<!-- @watch package.json 93-97 -->
- `copyReferenceAdvanced.displayCopiedTimeoutInMs` The copied text is displayed as a status bar item for X ms. Use a value <= 0 to always hide the status bar item

<!-- @watch package.json 98-102 -->
- `copyReferenceAdvanced.prependToCopiedText` Some text that should be prepended to the whole copied text

<!-- @watch package.json 103-107 -->
- `copyReferenceAdvanced.appendToCopiedText` Some text that should be appended to the whole copied text

## Known Issues

## Release Notes

See [Changelog](CHANGELOG.md)

## Install extension locally

https://code.visualstudio.com/Docs/editor/extension-gallery#_common-questions

macOS: `~/.vscode/extensions`