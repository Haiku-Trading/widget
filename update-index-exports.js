#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'widget/src/components/icons');
const networksDir = path.join(iconsDir, 'networks');
const protocolsDir = path.join(iconsDir, 'protocols');

// Read the current index.ts
const indexPath = path.join(iconsDir, 'index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

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

// Function to convert filename to component name
function getComponentName(fileName) {
  if (/^\d/.test(fileName)) {
    return `Chain${fileName}Icon`;
  }
  return fileName.charAt(0).toUpperCase() + fileName.slice(1).toLowerCase() + 'Icon';
}

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
fs.writeFileSync(indexPath, newContent);

console.log('Updated index.ts with organized folder structure:');
console.log(`- Main icons: ${mainIcons.length}`);
console.log(`- Network icons: ${networkIcons.length}`);
console.log(`- Protocol icons: ${protocolIcons.length}`);
console.log(`- Total exports: ${newExports.length}`);
