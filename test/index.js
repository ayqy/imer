const fs = require('fs');
const path = require('path');

const casesFolder = path.join(__dirname, 'cases');

// Expose globals for cases
global.assert = require('assert');
global.produce = require('../dist/umd/index').produce;
global.runCase = require('./lib/runCase');

describe('imer', () => {
  const testFiles = loadTestFiles(casesFolder);
  testFiles.forEach(filePath => {
    const desc = path.relative(casesFolder, filePath);
    runTest(filePath, desc.replace(path.extname(desc), ''));
  });
});

function runTest(testFile, desc) {
  describe(desc, () => {
    require(testFile);
  });
}

function loadTestFiles(casesFolder) {
  const testFiles = fs.readdirSync(casesFolder)
    .filter(fileName => !fileName.startsWith('.'))
    .map(fileName => path.resolve(casesFolder, fileName))
    .reduce((a, filePath) => {
      let files = [filePath];
      if (fs.statSync(filePath).isDirectory()) {
        files = loadTestFiles(filePath);
      }
      return a.concat(files);
    }, []);

  return testFiles;
}
