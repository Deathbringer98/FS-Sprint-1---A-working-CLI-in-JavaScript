// Import required modules
const fs = require('fs').promises;
const path = require('path');
const yargs = require('yargs');

// Load templates
const templates = require('./templates');

// Function to initialize the application
async function initializeApp(options) {
  try {
    // Check the values of the options
    if (options.all) {
      await createFolderStructure();
      await createConfigFiles();
      console.log('Initialization successful');
    } else if (options.mk) {
      await createFolderStructure();
      console.log('Folder structure creation successful');
    } else if (options.cat) {
      await createConfigFiles();
      console.log('Configuration files creation successful');
    } else {
      displayUsage();
    }
  } catch (error) {
    console.error('Initialization failed:', error);
  }
}

// Function to create folder structure
async function createFolderStructure() {
  const folders = ['json'];
  let createdCount = 0;
  for (const folder of folders) {
    const folderPath = path.join(__dirname, folder);
    try {
      await fs.mkdir(folderPath);
      console.log(`Folder created: ${folderPath}`);
      createdCount++;
    } catch (error) {
      if (error.code === 'EEXIST') {
        console.log(`Folder already exists: ${folderPath}`);
      } else {
        throw error;
      }
    }
  }
  console.log(`${createdCount === 0 ? 'All' : createdCount} folders ${createdCount === 0 ? 'already exist' : 'were created'}.`);
}

// Function to create configuration files
async function createConfigFiles() {
  try {
    const configPath = path.join(__dirname, 'json', 'config.json');
    const tokenPath = path.join(__dirname, 'json', 'tokens.json');

    await fs.writeFile(configPath, JSON.stringify(templates.configjson, null, 2));
    console.log(`Config file created: ${configPath}`);

    await fs.writeFile(tokenPath, JSON.stringify(templates.tokenjson, null, 2));
    console.log(`Token file created: ${tokenPath}`);
  } catch (error) {
    console.error('Configuration files creation failed:', error);
  }
}

// Function to display usage information
async function displayUsage() {
  try {
    const usageData = await fs.readFile(path.join(__dirname, 'usage.txt'), 'utf-8');
    console.log(usageData);
  } catch (error) {
    console.error('Display usage failed:', error);
  }
}

// Parse command-line arguments using yargs
yargs
  .option('all', {
    describe: 'Initialize everything',
    type: 'boolean',
    alias: 'a'
  })
  .option('mk', {
    describe: 'Create folder structure',
    type: 'boolean'
  })
  .option('cat', {
    describe: 'Create configuration files',
    type: 'boolean'
  })
  .command('*', 'Initialize the application', {}, (argv) => {
    initializeApp(argv);
  })
  .demandCommand(1, 'Please provide a valid command')
  .help()
  .argv;
