const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Color replacements to apply
const replacements = [
  // Theme colors
  { from: 'theme-indigo-50', to: 'teal-50' },
  { from: 'theme-indigo-100', to: 'teal-100' },
  { from: 'theme-indigo-200', to: 'teal-200' },
  { from: 'theme-indigo-300', to: 'teal-300' },
  { from: 'theme-indigo-400', to: 'teal-400' },
  { from: 'theme-indigo-500', to: 'teal-500' },
  { from: 'theme-indigo-600', to: 'teal-600' },
  { from: 'theme-indigo-700', to: 'teal-700' },
  { from: 'theme-indigo-800', to: 'teal-800' },
  { from: 'theme-indigo-900', to: 'teal-900' },
  
  // Violet theme colors
  { from: 'theme-violet-50', to: 'teal-50' },
  { from: 'theme-violet-100', to: 'teal-100' },
  { from: 'theme-violet-200', to: 'teal-200' },
  { from: 'theme-violet-300', to: 'teal-300' },
  { from: 'theme-violet-400', to: 'teal-400' },
  { from: 'theme-violet-500', to: 'teal-500' },
  { from: 'theme-violet-600', to: 'teal-600' },
  { from: 'theme-violet-700', to: 'teal-700' },
  { from: 'theme-violet-800', to: 'teal-800' },
  { from: 'theme-violet-900', to: 'teal-900' },
  
  // Direct replacements
  { from: 'indigo-50', to: 'teal-50' },
  { from: 'indigo-100', to: 'teal-100' },
  { from: 'indigo-200', to: 'teal-200' },
  { from: 'indigo-300', to: 'teal-300' },
  { from: 'indigo-400', to: 'teal-400' },
  { from: 'indigo-500', to: 'teal-500' },
  { from: 'indigo-600', to: 'teal-600' },
  { from: 'indigo-700', to: 'teal-700' },
  { from: 'indigo-800', to: 'teal-800' },
  { from: 'indigo-900', to: 'teal-900' },
  
  // Direct violet replacements
  { from: 'violet-50', to: 'teal-50' },
  { from: 'violet-100', to: 'teal-100' },
  { from: 'violet-200', to: 'teal-200' },
  { from: 'violet-300', to: 'teal-300' },
  { from: 'violet-400', to: 'teal-400' },
  { from: 'violet-500', to: 'teal-500' },
  { from: 'violet-600', to: 'teal-600' },
  { from: 'violet-700', to: 'teal-700' },
  { from: 'violet-800', to: 'teal-800' },
  { from: 'violet-900', to: 'teal-900' },
];

// Function to process a file
async function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    
    // Read the file content
    const content = await readFile(filePath, 'utf8');
    
    // Apply all replacements
    let newContent = content;
    for (const { from, to } of replacements) {
      const regex = new RegExp(from, 'g');
      newContent = newContent.replace(regex, to);
    }
    
    // Write the modified content back to the file
    if (content !== newContent) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏩ No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
}

// Function to walk through directory and find files
async function processDirectory(directory, extension) {
  const files = fs.readdirSync(directory);
  let changeCount = 0;
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      changeCount += await processDirectory(fullPath, extension);
    } else if (file.endsWith(extension)) {
      // Process files with the specified extension
      const changed = await processFile(fullPath);
      if (changed) changeCount++;
    }
  }
  
  return changeCount;
}

// Main function
async function main() {
  const targetDir = path.join(__dirname, '..', 'app', 'patient');
  const fileExtension = '.tsx';
  
  console.log('🎨 Applying teal theme to patient pages...');
  console.log('----------------------------------------');
  
  const changeCount = await processDirectory(targetDir, fileExtension);
  
  console.log('----------------------------------------');
  console.log(`✨ Theme update complete! Updated ${changeCount} files.`);
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
}); 