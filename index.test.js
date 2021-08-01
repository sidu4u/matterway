const {deepStrictEqual} = require('assert');
const {getAllFilesExcept} = require('./index');

function it(testName, callback) {
  try {
    callback();
    console.log(`\x1b[32m${testName}\x1b[0m SUCCESS`);
  } catch (error) {
    console.log(`\x1b[31m${testName}\x1b[0m FAILED`, error);
  }
}

it('should return all files if no ignore patterns provided', () => {
  deepStrictEqual(
    getAllFilesExcept(
      [
        {isDirectory: false, name: 'package.json'},
        {isDirectory: false, name: 'index.js'},
        {isDirectory: true, name: 'src', files: []}
      ],
      []
    ).sort(),
    ['/index.js', '/package.json'].sort()
  );
});

it('should work - example from readme', () => {
  deepStrictEqual(
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
    ).sort(),
    ['/package.json', '/dist/index.js'].sort()
  );
});

it('should ignore a top level file', () => {
  deepStrictEqual(
    getAllFilesExcept(
      [
        {isDirectory: false, name: 'package.json'},
        {isDirectory: false, name: 'index'},
        {isDirectory: false, name: 'index (2)'},
        {
          isDirectory: true,
          name: 'src',
          files: [
            {isDirectory: false, name: 'index.js'}
          ]
        }
      ],
      ['/index']
    ).sort(),
    ['/package.json', '/index (2)', '/src/index.js'].sort()
  );
});

it('should ignore a top level directory', () => {
  deepStrictEqual(
    getAllFilesExcept(
      [
        {isDirectory: false, name: 'index.js'},
        {
          isDirectory: true,
          name: 'src',
          files: [
            {isDirectory: false, name: 'index.js'},
            {isDirectory: false, name: 'test.js'}
          ]
        },
        {
          isDirectory: true,
          name: 'src (2)',
          files: [
            {
              isDirectory: true,
              name: 'src',
              files: [
                {isDirectory: false, name: 'index2.js'}
              ]
            }
          ]
        }
      ],
      ['/src']
    ).sort(),
    ['/index.js', '/src (2)/src/index2.js'].sort()
  );
});

it('should whitelist a file inside directory', () => {
  deepStrictEqual(
    getAllFilesExcept(
      [
        {isDirectory: false, name: 'index.js'},
        {
          isDirectory: true,
          name: 'src',
          files: [
            {isDirectory: false, name: 'index.js'},
            {isDirectory: false, name: 'test.js'}
          ]
        },
        {
          isDirectory: true,
          name: 'src (2)',
          files: [
            {isDirectory: false, name: 'a.js'},
            {
              isDirectory: true,
              name: 'src',
              files: [
                {isDirectory: false, name: 'index2.js'},
                {isDirectory: false, name: 'b.js'}
              ]
            }
          ]
        }
      ],
      ['!/src (2)/src/index2.js.js', '/src (2)', '!/src (2)/src/b.js', '/src']
    ).sort(),
    ['/index.js', '/src (2)/src/b.js'].sort()
  );
});

it('should work for edge cases', () => {
  deepStrictEqual(
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
      ['/some-random', '!/index.js', '!/dist/bin', '/dist/bin', '!/dist/another-random']
    ).sort(),
    ['/package.json', '/index.js', '/dist/index.js'].sort()
  );
});
