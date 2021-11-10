// Save this into a file and run using "fliplet-agent start ./path/to/file.js"

module.exports.config = {
  // Fliplet authorization token from Fliplet Studio
  authToken: 'eu--123456789',

  // Set to true to test the integration without sending any data to Fliplet servers
  isDryRun: false,

  // If set to true, operations will run when the script starts.
  // Otherwise, they will just run according to their frequency.
  syncOnInit: true,

  // Define the log verbosity, between "debug", "info" and "critical".
  logVerbosity: 'debug',

  // Database connection settings (using Sequelize format)
  // http://docs.sequelizejs.com/
  database: {
    dialect: 'mssql',
    host: 'localhost',
    username: 'foo',
    password: 'bar',
    port: 1234,
    database: 'myDatabaseName'

    // MSSQL Server and ODBC only: uncomment if you need to use these settings
    /*
    dialectOptions: {
      domain: 'myDomain',
      instanceName: 'myInstanceName',

      // Only add this if you're using ODBC and you have installed it
      // by running "npm install sequelize-odbc-mssql -g" on the terminal
      dialectModulePath: 'sequelize-odbc-mssql',
      encrypt: false
    }
    */
  }
};

module.exports.setup = (agent) => {

  // Push data from your table to a Fliplet Data Source
  agent.push({
    // Description of your operation (will be printed out in the logs)
    description: 'Pushes data from my table to Fliplet',

    // Frequency of running using unix cronjob syntax
    frequency: '* * * * *',

    // The query (or operation) to run to fetch the data to be pushed to Fliplet.
    // You should define a function returning a promise with the data.
    // In our example, we fetch the data using a SQL query from the local database.
    sourceQuery: (db) => {
      return db.query('SELECT id, email, "updatedAt" FROM users order by id asc;')
    },

    // Define which column should be used as primary key
    // to understand whether a record already exists on the Fliplet Data Source
    primaryColumnName: 'id',

    // Choose whether the primary column should be considered case-sensitive or not.
    caseInsensitivePrimaryColumn: true,

    // Define which (optional) column should be used to compare whether
    // the record has been updated on your database since it got inserted
    // to the Fliplet Data Source hence might require updating
    timestampColumnName: 'updatedAt',

    // Define whether remote entries on Fliplet servers should be kept or deleted when
    // they are not found in the local dataset returned by the query result.
    // Using "update" will keep orphaned entries while "replace" will delete them.
    mode: 'update',

    // Define which (optional) column should be used to compare whether
    // the record has been flagged as deleted on your database and should
    // be removed from the Fliplet Data Source
    deleteColumnName: deletedAt,

    // The ID of the Fliplet Data Source where data should be inserted to
    targetDataSourceId: 123,

    // Define which (optional) post-sync hooks should run on the data source data when received
    // by Fliplet servers. Hook types are "insert" and "update"
    runHooks: [],

    // Define whether updating entries will merge local columns with remote columns.
    // This is useful if your data is updated by Fliplet Apps.
    merge: true,

    files: [
      // Define a column containing a remote URL to a file, e.g. "https://example.org/John.jpg"
      // { column: 'thumbnail', type: 'remote' },

      // Define a column containing a local absolute URL to a file, e.g. "/home/user/John.jpg"
      // { column: 'thumbnail', type: 'local' },

      // Define a column containing a relative URL to a file in the specified directory, e.g. "John.jpg"
      // { column: 'thumbnail', type: 'local', directory: '/path/to/dir' }
    ],

    // Define how many records and files should be parsed and requested at once.
    // Depending on how much load your system can sustain you can increase this number.
    concurrency: 1,

    // Define an optional callback to be fires post-sync
    onSync: (commits) => {}
  });

  // You can define any other operation similar to the above here using "agent.push()"

};
