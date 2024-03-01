// Import required modules
const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const crc32 = require('crc/crc32');

// Function to list all tokens
async function tokenList() {
  try {
    // Read tokens from JSON file
    const data = await fs.readFile(path.join(__dirname, 'json', 'tokens.json'), 'utf-8');
    const tokens = JSON.parse(data);
    
    // Log user list with tokens
    console.log('** User List **');
    tokens.forEach(obj => {
      console.log(` * ${obj.username}: ${obj.token}`);
    });
  } catch (error) {
    console.error('Failed to list tokens:', error);
  }
}

// Function to generate a new token for a given username
async function newToken(username) {
  try {
    // Read tokens from JSON file
    const data = await fs.readFile(path.join(__dirname, 'json', 'tokens.json'), 'utf-8');
    const tokens = JSON.parse(data);
    
    // Define new token object
    const newToken = {
      created: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      username: username,
      email: 'user@example.com', // Placeholder email
      phone: '5556597890', // Placeholder phone number
      token: crc32(username).toString(16), // Generate token using CRC32 hash
      expires: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd HH:mm:ss'), // Token expires in 3 days
      confirmed: 'tbd' // Placeholder confirmation status
    };

    // Add new token to the tokens array
    tokens.push(newToken);

    // Write updated tokens array back to the JSON file
    await fs.writeFile(path.join(__dirname, 'json', 'tokens.json'), JSON.stringify(tokens, null, 2));

    console.log(`New token ${newToken.token} was created for ${username}.`);
    return newToken.token;
  } catch (error) {
    console.error('Failed to create new token:', error);
  }
}

// Export tokenApp function for use in other modules
module.exports = {
  tokenApp: async function() {
    try {
      // Extract command line arguments
      const myArgs = process.argv.slice(2);

      // Switch statement to determine action based on command
      switch (myArgs[0]) {
        case '--list':
          await tokenList();
          break;
        case '--new':
          if (myArgs.length < 2) {
            console.log('Invalid syntax. Usage: node myapp token --new [username]');
          } else {
            await newToken(myArgs[1]);
          }
          break;
        default:
          console.log('Invalid option. Usage: node myapp token [--list | --new username]');
      }
    } catch (error) {
      console.error('Failed to execute token command:', error);
    }
  }
};
