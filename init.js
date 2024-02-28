const { promises: fsPromises, existsSync, writeFile, readFile } = require('fs');
const { resolve } = require('path');
const { directoryTemplates, configTemplate, tokenTemplate } = require('./templates');

async function generateDirectories() {
  if(DEBUG) console.log('generateDirectories()');
  let createdCount = 0;
  for (const dir of directoryTemplates) {
    if(DEBUG) console.log(dir);
    try {
      const dirPath = resolve(__dirname, dir);
      if(!existsSync(dirPath)) {
        await fsPromises.mkdir(dirPath);
        createdCount++;
      }
    } catch (err) {
      console.error(err);
    }
  }
  console.log(`${createdCount === 0 ? 'All' : createdCount} folders ${createdCount === 0 ? 'already exist' : 'were created'}.`);
}

async function generateConfigFiles() {
  if(DEBUG) console.log('generateConfigFiles()');
  try {
    const configData = JSON.stringify(configTemplate, null, 2);
    const configPath = resolve(__dirname, './json/config.json');
    if(!existsSync(configPath)) {
      await writeFile(configPath, configData);
      console.log('Data written to config file.');
    } else {
      console.log('config file already exists.');
    }

    const tokenData = JSON.stringify(tokenTemplate, null, 2);
    const tokenPath = resolve(__dirname, './json/tokens.json');
    if(!existsSync(tokenPath)) {
      await writeFile(tokenPath, tokenData);
      console.log('Data written to tokens file.');
    } else {
      console.log('token file already exists.');
    }
  } catch(err) {
    console.error(err);
  }
}

const commandArgs = process.argv.slice(2);

async function setupApplication() {
  if(DEBUG) console.log('setupApplication()');

  switch (commandArgs[1]) {
    case '--all':
      if(DEBUG) console.log('--all generateDirectories() & generateConfigFiles()');
      await generateDirectories();
      await generateConfigFiles();
      break;
    case '--cat':
      if(DEBUG) console.log('--cat generateConfigFiles()');
      await generateConfigFiles();
      break;
    case '--mk':
      if(DEBUG) console.log('--mk generateDirectories()');
      await generateDirectories();
      break;
    case '--help':
    case '--h':
    default:
      const usageData = await readFile(resolve(__dirname, "/usage.txt"));
      console.log(usageData.toString());
  }
}

module.exports = {
  setupApplication,
}