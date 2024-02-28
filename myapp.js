// Set DEBUG flag
global.DEBUG = true;

// Import required modules
const fs = require("fs");

// Import functionalities from other modules
const { initializeApp } = require('./init.js');
const { configApp } = require('./config.js');
const { tokenApp } = require('./token.js');

// Extract command line arguments
const myArgs = process.argv.slice(2);

// Check DEBUG flag and log arguments if enabled
if (DEBUG && myArgs.length >= 1) {
  console.log('Arguments passed to myapp:', myArgs);
}

// Switch statement to handle different commands
switch (myArgs[0]) {
  case 'init':
  case 'i':
      if (DEBUG) console.log('Initializing the app...');
      initializeApp();
      break;
  case 'config':
  case 'c':
      if (DEBUG) console.log('Displaying the configuration file...');
      configApp();
      break;
  case 'token':
  case 't':
      if (DEBUG) console.log('Generating a user token...');
      tokenApp();
      break;  
  case '--help':
  case '--h':
  default:
      // Read usage information from file and display
      fs.readFile(__dirname + "/usage.txt", (error, data) => {
          if (error) throw error;
          console.log(data.toString());
      });
}
