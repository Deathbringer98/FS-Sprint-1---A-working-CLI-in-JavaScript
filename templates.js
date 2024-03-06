// Define folders in the application directory
const folders = ['models', 'views', 'routes', 'logs', 'json'];

// Define default configuration for the application
const configjson = { 
  name: 'MyAppCLI',
  version: '1.0.0',
  description: 'Command Line Interface (CLI) for MyApp.',
  main: 'myapp.js',
  superuser: 'admin',
  database: 'mydatabase'
};

// Define a default token template
const tokenjson = [{
  created: '1970-01-01 00:00:00',
  username: 'user',
  email: 'user@example.com',
  phone: '555-123-4567',
  token: '1234567890',
  expires: '1970-01-04 00:00:00',
  confirmed: 'pending'
}];

// Export the template objects for use in other parts of the application
module.exports = {
  folders,      // Export folders array
  configjson,   // Export configjson object
  tokenjson,    // Export tokenjson object
};
