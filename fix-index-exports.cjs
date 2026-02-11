#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src/components/icons');
const networksDir = path.join(iconsDir, 'networks');
const protocolsDir = path.join(iconsDir, 'protocols');

// Function to convert filename to proper component name
function getComponentName(fileName) {
  // Handle numeric names (chain IDs)
  if (/^\d/.test(fileName)) {
    return `Chain${fileName}Icon`;
  }
  
  // Convert kebab-case to PascalCase
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('') + 'Icon';
}

// Get all icon files in each directory
const mainIcons = fs.readdirSync(iconsDir)
  .filter(file => file.endsWith('-icon.tsx'))
  .map(file => file.replace('-icon.tsx', ''));

const networkIcons = fs.readdirSync(networksDir)
  .filter(file => file.endsWith('-icon.tsx'))
  .map(file => file.replace('-icon.tsx', ''));

const protocolIcons = fs.readdirSync(protocolsDir)
  .filter(file => file.endsWith('-icon.tsx'))
  .map(file => file.replace('-icon.tsx', ''));

// Generate new exports
let newExports = [];

// Main icons (in root)
mainIcons.forEach(fileName => {
  const componentName = getComponentName(fileName);
  newExports.push(`export { ${componentName} } from './${fileName}-icon'`);
});

// Network icons
networkIcons.forEach(fileName => {
  const componentName = getComponentName(fileName);
  newExports.push(`export { ${componentName} } from './networks/${fileName}-icon'`);
});

// Protocol icons
protocolIcons.forEach(fileName => {
  const componentName = getComponentName(fileName);
  newExports.push(`export { ${componentName} } from './protocols/${fileName}-icon'`);
});

// Write the new index.ts
const newContent = newExports.join('\n') + '\n';
fs.writeFileSync(path.join(iconsDir, 'index.ts'), newContent);

console.log('Fixed index.ts with proper component names:');
console.log(`- Main icons: ${mainIcons.length}`);
console.log(`- Network icons: ${networkIcons.length}`);
console.log(`- Protocol icons: ${protocolIcons.length}`);
console.log(`- Total exports: ${newExports.length}`);

// Show some examples
console.log('\nExample component names:');
console.log(`alert-circle -> ${getComponentName('alert-circle')}`);
console.log(`chevron-down -> ${getComponentName('chevron-down')}`);
console.log(`1 -> ${getComponentName('1')}`);
console.log(`AAVE_V3 -> ${getComponentName('AAVE_V3')}`);
