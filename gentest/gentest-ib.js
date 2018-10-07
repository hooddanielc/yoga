#!/bin/env node
const path = require('path');
const fs = require('fs');

const test_dir = path.resolve(__dirname, '..', 'tests');
const ib_tests = path.resolve(__dirname, '..', 'ib_tests');

// Create ib_tests dir if not exists
if (!fs.existsSync(ib_tests)) {
  fs.mkdirSync(ib_tests);
}

// For every file found in root of test dir, create an ib executable target
// and place in ib_tests folder. This is not recursive.
const test_filenames = fs.readdirSync(test_dir);
test_filenames.forEach((filename) => {
  const absolute_path = path.join(test_dir, filename);
  const stats = fs.statSync(absolute_path);
  if (stats.isFile()) {
    const content = fs.readFileSync(absolute_path, 'utf8');
    const ext = path.extname(absolute_path);
    const basename = path.basename(absolute_path, ext);
    const ib_test_filename = path.join(ib_tests, `${basename}-test.cc`);

    fs.writeFileSync(ib_test_filename, [
      content,
      '',
      `  
      int main(int argc, char **argv) {
          testing::InitGoogleTest(&argc, argv);
          return RUN_ALL_TESTS();
      }
      `
    ].join('\n'));
  }
});

console.log('ib_tests targets commpleted. Run ib --test_all ib_tests');
