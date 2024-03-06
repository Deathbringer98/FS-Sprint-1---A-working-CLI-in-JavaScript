// Import required modules 
const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const yargs = require("yargs");

// Load templates
const templates = require("./templates");

// Initialize Express app
const app = express();
const port = 3000;

// Serve index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Handle POST request for user registration
app.post('/submit_registration', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const phone = req.body.phone; // Extract phone from the request body
    const token = generateToken();
  
    // Save token to tokens.json file
    addToken(username, email, phone, token); // Pass phone to the addToken function
  
    // Send response with the created username, email, phone, and token
    res.json({ created: new Date().toISOString(), username: username, email: email, phone: phone, token: token }); // Update this line to include the username, email, phone, and token
});
// Function to generate a random token
function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

// Function to initialize the application
async function initializeApp(options) {
    try {
        // Check the values of the options
        if (options.all) {
            await createFolderStructure();
            await createConfigFiles();
            console.log("Initialization successful");
        } else if (options.mk) {
            await createFolderStructure();
            console.log("Folder structure creation successful");
        } else if (options.cat) {
            await createConfigFiles();
            console.log("Configuration files creation successful");
        } else {
            displayUsage();
        }
    } catch (error) {
        console.error("Initialization failed:", error);
    }
}

// Function to create folder structure
async function createFolderStructure() {
    const folders = ["json"];
    let createdCount = 0;
    for (const folder of folders) {
        const folderPath = path.join(__dirname, folder);
        try {
            await fs.mkdir(folderPath);
            console.log(`Folder created: ${folderPath}`);
            createdCount++;
        } catch (error) {
            if (error.code === "EEXIST") {
                console.log(`Folder already exists: ${folderPath}`);
            } else {
                throw error;
            }
        }
    }
    console.log(
        `${createdCount === 0 ? "All" : createdCount} folders ${
        createdCount === 0 ? "already exist" : "were created"
        }.`
    );
}

// Function to create configuration files
async function createConfigFiles() {
    try {
        const configPath = path.join(__dirname, "json", "config.json");
        const tokenPath = path.join(__dirname, "json", "tokens.json");

        await fs.writeFile(
            configPath,
            JSON.stringify(templates.configjson, null, 2)
        );
        console.log(`Config file created: ${configPath}`);

        await fs.writeFile(tokenPath, JSON.stringify(templates.tokenjson, null, 2));
        console.log(`Token file created: ${tokenPath}`);
    } catch (error) {
        console.error("Configuration files creation failed:", error);
    }
}

// Function to update token entry 
async function updateToken(field, username, value) {
    try {
        const tokenPath = path.join(__dirname, "json", "tokens.json");
        let tokens = [];

        try {
            const existingTokens = await fs.readFile(tokenPath, "utf-8");
            tokens = JSON.parse(existingTokens);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        const tokenToUpdateIndex = tokens.findIndex(token => token.username === username);

        if (tokenToUpdateIndex !== -1) {
            // Add quotes around the value if it's a phone number
            const updatedValue = field === 'phone' ? `"${value}"` : value;

            tokens[tokenToUpdateIndex][field] = updatedValue;
            await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
            console.log(`Updated ${field} for ${username} to ${updatedValue}`);
        } else {
            console.log(`Token entry not found for username: ${username}`);
        }
    } catch (error) {
        console.error("Failed to update token:", error);
    }
}

// Function to add a new token entry
async function addToken(username, email, phone, expires, confirmed) {
    try {
        const tokenPath = path.join(__dirname, "json", "tokens.json");
        let tokens = [];

        try {
            const existingTokens = await fs.readFile(tokenPath, "utf-8");
            tokens = JSON.parse(existingTokens);
        } catch (error) {
            if (error.code !== "ENOENT") {
                throw error;
            }
        }

        const token = generateToken(); // Generate a random token

        const newToken = {
            created: new Date().toISOString(),
            username,
            email,
            phone,
            token,
            expires,
            confirmed
        };

        tokens.push(newToken);
        await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
        console.log(`Added new token for username: ${username}`);
    } catch (error) {
        console.error("Failed to add token:", error);
    }
}

// Function to display usage information
async function displayUsage(command) {
    try {
        const usageData = await fs.readFile(path.join(__dirname, "usage.txt"), "utf-8");
        console.log(usageData);
    } catch (error) {
        console.error("Failed to load usage information:", error);
    }
}

// Parse command-line arguments using yargs
yargs
    .command({
        command: 'init',
        describe: 'Initialize the application',
        handler: () => {
            displayUsage('init');
        }
    })
    .command({
        command: 'config',
        describe: 'Manage application configuration settings.',
        handler: () => {
            console.log("Manage application configuration settings.");
        }
    })
    .command({
        command: 'add',
        describe: 'Add a new token entry',
        builder: (yargs) => {
            return yargs.option('new', {
                describe: 'Add a new token entry (format: --new username email phone expires confirmed)',
                type: 'array',
                demandOption: true
            });
        },
        handler: async (argv) => {
            const { new: newToken } = argv;
            if (newToken.length === 5) { // Adjusted for the removed token parameter
                const [username, email, phone, expires, confirmed] = newToken;
                await addToken(username, email, phone, expires, confirmed);
            } else {
                console.log(
                    "Please provide a valid username, email, phone, expires, and confirmed for the new token."
                );
            }
        }
    })
    .command({
        command: 'token',
        describe: 'Update token entry',
        builder: (yargs) => {
            return yargs.option('upd', {
                describe: 'Update token entry (format: --upd field username value)',
                type: 'array',
                demandOption: true
            });
        },
        handler: async (argv) => {
            const { upd } = argv;
            if (upd.length === 3) {
                const [field, username, value] = upd;
                await updateToken(field, username, value);
            } else {
                console.log(
                    "Please provide a valid field, username, and value for the token update."
                );
            }
        }
    })
    .demandCommand(1, 'Please provide a valid command')
    .help()
    .argv;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}).on('error', (err) => {
  console.error(`Error starting server: ${err.message}`);
});
