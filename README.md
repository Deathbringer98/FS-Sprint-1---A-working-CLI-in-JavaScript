# MyApp CLI

MyApp CLI is a Command Line Interface (CLI) application designed to manage user tokens and configuration for MyApp.

## Installation

To install MyApp CLI, you need to have Node.js installed on your system. Then, you can install it globally using npm:

```bash
npm install -g myapp-cli
```

## Usage

MyApp CLI provides several commands to manage configuration and tokens. Here are the available commands:

### Initialize the App
```bash
myapp init           # Initialize the app
myapp init --mk      # Create all app folders
myapp init --cat     # Create all app files
myapp init --all     # Create all folders and files
```

### Manage Configuration
```bash
myapp config         # Create or change the app configuration
myapp config --show  # Show the contents of the config file
myapp config --reset # Reset back to default the config file
myapp config --set   # Set a specific attribute of the config file
```

### Manage User Tokens
```bash
myapp token          # Manage the user tokens
myapp token --list   # List all the tokens
myapp token --count  # Provide a count of all the tokens
myapp token --new    # Add a new token
```

### Help
```bash
myapp --help         # Display help
```

## Contributing

If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request on GitHub.

## License


This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.