const fs = require('fs');
const path = require('path');

console.log('Running patch_upng.cjs...');

function patchFile(relPath, searchPattern, replacement) {
  const fullPath = path.resolve(__dirname, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log('File not found, skipping:', relPath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (content.includes('PAKO_PATCHED')) {
    console.log('Already patched:', relPath);
    return;
  }
  if (searchPattern instanceof RegExp ? searchPattern.test(content) : content.includes(searchPattern)) {
    content = content.replace(searchPattern, replacement);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Successfully patched:', relPath);
  } else {
    console.log('Search pattern not matched in:', relPath);
  }
}

// 1. Patch @pdf-lib/upng/cjs/UPNG.js
patchFile(
  'node_modules/@pdf-lib/upng/cjs/UPNG.js',
  'UPNG.inflateRaw = function () {',
  '// PAKO_PATCHED\nUPNG.inflateRaw = function (data) { try { var pako = require("pako"); return pako.inflateRaw(data); } catch(e) {} };\nUPNG._old_inflateRaw = function () {'
);

// 2. Patch @pdf-lib/upng/UPNG.js
patchFile(
  'node_modules/@pdf-lib/upng/UPNG.js',
  'UPNG.inflateRaw=function(){',
  '// PAKO_PATCHED\nUPNG.inflateRaw=function(data){try{var pako=require("pako");return pako.inflateRaw(data);}catch(e){}};\nUPNG._old_inflateRaw=function(){'
);

// 3. Patch @pdf-lib/upng/dist/UPNG.js
patchFile(
  'node_modules/@pdf-lib/upng/dist/UPNG.js',
  'UPNG.inflateRaw=function(){',
  '// PAKO_PATCHED\nUPNG.inflateRaw=function(data){try{var pako=require("pako");return pako.inflateRaw(data);}catch(e){}};\nUPNG._old_inflateRaw=function(){'
);

// 4. Patch pdf-lib/dist/pdf-lib.esm.js
patchFile(
  'node_modules/pdf-lib/dist/pdf-lib.esm.js',
  'UPNG.inflateRaw=function(){',
  '// PAKO_PATCHED\nUPNG.inflateRaw=function(data){try{var pako=require("pako");return pako.inflateRaw(data);}catch(e){}};\nUPNG._old_inflateRaw=function(){'
);

console.log('patch_upng.cjs completed.');
