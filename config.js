// Import required modules
const fs = require('fs').promises; // File system module for asynchronous file operations
const path = require('path'); // Module for working with file paths
const templates = require('./templates'); // Import configuration templates

// Function to display current configuration
async function showConfig() {
  try {
    // Construct path to the configuration file
    const configPath = path.join(__dirname, 'json', 'config.json');
    // Read the configuration file
    const data = await fs.readFile(configPath);
    // Parse JSON data and display configuration
    console.log(JSON.parse(data));
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Function to reset configuration to default
async function resetConfig() {
  try {
    // Construct path to the configuration file
    const configPath = path.join(__dirname, 'json', 'config.json');
    // Write default configuration to the configuration file
    await fs.writeFile(configPath, JSON.stringify(templates.configTemplate, null, 2));
    // Log success message
    console.log('Config file reset to original state');
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Function to set specific configuration option
async function setConfig(key, value) {
  try {
    // Construct path to the configuration file
    const configPath = path.join(__dirname, 'json', 'config.json');
    // Read the configuration file
    const data = await fs.readFile(configPath);
    // Parse JSON data
    const config = JSON.parse(data);
    // Check if the provided key exists in the configuration
    if (config.hasOwnProperty(key)) {
      // Update configuration with new value
      config[key] = value;
      // Write updated configuration to the configuration file
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      // Log success message
      console.log('Config file successfully updated.');
    } else {
      // Log error message for invalid key
      console.log(`Invalid key: ${key}, try another.`);
    }
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Function to handle configuration-related commands
async function configApp(action, option, value) {
  try {
    // Switch statement to determine action based on command
    switch (action) {
      // Case for displaying current configuration
      case '--show':
        await showConfig();
        break;
      // Case for resetting configuration to default
      case '--reset':
        await resetConfig();
        break;
      // Case for setting specific configuration option
      case '--set':
        await setConfig(option, value);
        break;
      // Default case for displaying usage information
      default:
        // Read usage information from file
        const usageData = await fs.readFile(path.join(__dirname, 'usage.txt'));
        // Log usage information
        console.log(usageData.toString());
    }
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}

// Export configApp function for use in other modules
module.exports = {
  configApp
};
