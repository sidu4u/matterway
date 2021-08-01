## Task

You will need to implement a function that will get an array of files (files can be directories) and an array of ignore patterns and will return an array of all files full paths (excluding directories!) that are not ignored.

To keep it simple, ignore patterns are always absolute paths and do not contain wildcards.

### Function Arguments

1. `files` - an array of plain objects with 3 propeties:

  - `isDirectory` - boolean.
  - `name` - non-empty string that does not contain `!`, `/`, `\n` characters.
  - `files` - in case of a directory an array of files, otherwise not defined.

2. `ignorePatterns` - an array of non-empty strings that always start with `/` (or `!/` for whitelisting) and always end with a file (or directory) name.

For example, pattern `/src/index.js` will ignore only `index.js` file located in a **top-level** `src` directory.

Another example: pattern `!/package.json` will whitelist only a top-level `package.json` file (but it will not whitelist any `package.json` files located in directories).

**Important!**

Each next pattern in `ignorePatterns` array has a priority over previous ignore patterns (even if the latter are more specific).
So `["!/src/index.js", "/src"]` will fully ignore a top-level `src` directory, because `/src` is listed last.

### Function Output

An array of **full** file paths. It must *not* include directories. Each path should start with `/` and end with a file name. Order does not matter.

### Example

```javascript
const getAllFilesExcept = (files, ignorePatterns) => {
  // TODO
};
getAllFilesExcept(
  [
    {isDirectory: false, name: 'index.js'},
    {isDirectory: false, name: 'package.json'},
    {
      isDirectory: true,
      name: 'dist',
      files: [
        {isDirectory: false, name: 'index.js'},
        {isDirectory: false, name: 'bin'}
      ]
    }
  ],
  ['/dist', '!/dist/index.js', '/index.js']
); // returns ['/package.json', '/dist/index.js']
```

### Run Tests

```bash
node index.test.js
```

### Tip

You do not need to write validation (e.g. there won't be files with the same name under the same directory) or optimize your solution for performance.
