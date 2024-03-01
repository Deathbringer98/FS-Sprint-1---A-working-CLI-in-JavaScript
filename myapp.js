// Import required modules
const fs = require("fs").promises;
const path = require("path");
const templates = require("./templates");
const { program } = require("commander"); // Corrected import

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

// Function to display usage information
async function displayUsage() {
  try {
    const usageData = await fs.readFile(
      path.join(__dirname, "usage.txt"),
      "utf-8"
    );
    console.log(usageData);
  } catch (error) {
    console.error("Display usage failed:", error);
  }
}

program
  .command("init")
  .option("--all", "Initialize everything")
  .option("--mk", "Create folder structure")
  .option("--cat", "Create configuration files")
  .action(initializeApp);

// Manage application configuration settings
program
  .command("config")
  .description("Manage application configuration settings.")
  .option("--show", "Display the current configuration settings.")
  .option("--reset", "Reset the configuration settings to default.")
  .option("--set <key> <value>", "Set a specific configuration attribute.")
  .action(async (options) => {
    const configPath = path.join(__dirname, "json", "config.json");
    let config;
    try {
      config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    } catch (error) {
      console.error("Failed to read configuration:", error);
      return;
    }

    if (options.show) {
      console.log(config);
    } else if (options.reset) {
      await fs.writeFile(
        configPath,
        JSON.stringify(templates.configjson, null, 2)
      );
      console.log("Configuration reset to default.");
    } else if (options.set) {
      const [key, value] = options.set.split("=");
      config[key] = value;
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
      console.log(`Configuration attribute ${key} set to ${value}.`);
    } else {
      console.log("Please provide an option for the config command.");
    }
  });

// token options
program
  .command("token")
  .description("Manage tokens.")
  .option("--help", "Display help for the token command")
  .option("--count", "Display a count of the tokens created")
  .option(
    "--new <username>",
    "Generate a token for a given username, saves tokens to the json file"
  )
  .option(
    "--upd <field> <username> <value>",
    'Update the json entry with a new value (field can be "p" for phone or "e" for email)'
  )
  .option(
    "--search <field> <value>",
    'Fetch a token for a given value (field can be "u" for username, "e" for email, or "p" for phone)'
  )
  .action(async (options) => {
    if (options.help) {
      // Display help for the token command
      program.help();
    } else if (options.count) {
      // Display a count of the tokens created
      await displayTokenCount();
    } else if (options.new) {
      // Generate a token for a given username
      await generateToken(options.new);
    } else if (options.upd) {
      // Update the json entry with a new value
      const [field, username, value] = options.upd.split(" ");
      await updateToken(field, username, value);
    } else if (options.search) {
      // Fetch a token for a given value
      const [field, value] = options.search.split(" ");
      await fetchToken(field, value);
    } else {
      console.log(
        "Please provide a valid option for the token command. Use --help for assistance."
      );
    }
  });

// Function to display count of tokens created
async function displayTokenCount() {
  try {
    const tokenPath = path.join(__dirname, "json", "tokens.json");
    const tokens = JSON.parse(await fs.readFile(tokenPath, "utf-8"));
    console.log(`Total tokens created: ${Object.keys(tokens).length}`);
  } catch (error) {
    console.error("Failed to display token count:", error);
  }
}

// Function to generate a token for a given username
async function generateToken(username) {
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

    const newToken = generateNewToken();

    tokens.push({ username: username, token: newToken });

    await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
    console.log(`Token generated for ${username} and saved to ${tokenPath}`);
  } catch (error) {
    console.error("Failed to generate token:", error);
  }
}

// Placeholder function for generating a token
function generateNewToken() {
  return Math.random().toString(36).substr(2);
}

// Function to update token entry
async function updateToken(field, username, value) {
  // Update token logic goes here
}

// Function to fetch token entry
async function fetchToken(field, value) {
  // Fetch token logic goes here
}

// Parse command-line arguments
program.parse(process.argv);
