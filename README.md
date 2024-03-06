Token Management System
This is a Node.js application for managing token entries stored in JSON files.

Features
Initialization: Initialize the application with folder structure and configuration files.
Configuration Management: Manage application configuration settings.
Token Management: Add new token entries and update existing ones.
Installation
Clone this repository:

bash
Copy code
git clone <https://github.com/Deathbringer98/FS-Sprint-1---A-working-CLI-in-JavaScript>
Install dependencies:

Copy code
npm install yargs
npm install express
Usage
Commands
Initialize the Application:

csharp
Copy code
node myapp.js init
This command initializes the application by creating necessary folder structures and configuration files.

Manage Application Configuration Settings:

arduino
Copy code
node myapp.js config
This command allows you to manage application configuration settings.

Add a New Token Entry:

php
Copy code
node myapp.js add --new <username> <email> <phone> <expires> <confirmed>
This command adds a new token entry. Replace <username>, <email>, <phone>, <expires>, and <confirmed> with appropriate values.

Update Token Entry:

php
Copy code
node myapp.js token --upd <field> <username> <value>
This command updates a token entry. Replace <field>, <username>, and <value> with appropriate values.

Examples
Initialize the application:

csharp
Copy code
node myapp.js init
Manage application configuration settings:

arduino
Copy code
node myapp.js config
Add a new token entry:

csharp
Copy code
node myapp.js add --new user1 user1@example.com 555-123-4567 "2024-12-31" true
Update expiration date for a token entry:

arduino
Copy code
node myapp.js token --upd expires user1 "2026-01-01"
License
This project is licensed under the MIT License - see the LICENSE file for details.

Initialization of app examples:
1. node myapp.js init
2. node myapp.js config
3. node myapp.js add --new user1 user1@example.com 555-123-4567 "2024-12-31" true
4. node myapp.js token --upd expires user1 "2026-01-01"
