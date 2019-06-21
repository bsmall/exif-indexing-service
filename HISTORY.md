# TypeScript / Node / Express Boilerplate
## Steps taken to build this boilerplate

1. Install node.js on developer workstation. As of May 30, 2019, using v10.16.0 LTS.

1. Install TypeScript on developer workstation via npm (global install). As of May 30, 2019, installed v3.5.1.

    `npm install -g typescript`

1. Install database server of choice on developer workstation - PostgreSQL, mysql, mongodb. 
    1. On iMac, installed PostgreSQL v11.3 using [installer package from EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
        1. Install path: `/Library/PostgreSQL/11`
        1. Data directory: `/Library/PostgreSQL/11/data`
        1. Database superuser (postgres) password: `postgres`
        1. Port: `5432`
        1. Also installed PostGIS 2.5 extension.
        
1. Created new folder for boilerplate project titled `typescript-node-express-boilerplate`, within the `~/tempdev` folder.

1. Initialize git repository

    `git init`
    
1. Add `.gitignore` file and populate. Note: more ignores will be added later with the build of this boilerplate. 

1. Add this file you're reading to root of project: `/HISTORY.md` and added content.

1. Perform initial commit of the project to confirm .gitignore is correctly configured and to start tracking changes to project files.

1. Initialize new node.js project (make initial package.json file).

    `npm init`
    
    Answer prompts as appropriate.
    1. package name: _use default of `typescript-node-express-boilerplate`_
    1. version: _use default of `1.0.0`_
    1. description: _Enter description of choice_
    1. entry point: `server.js`
    1. test command: _leave empty_
    1. git repository: _leave empty_
    1. keywords: _leave empty_
    1. author: 'Brian Small'  
    1. license: MIT
      
1. Initialize new `tsconfig.json` file.

    `tsc --init`
    
1. Set options in tsconfig.json.

1. Add .EditorConfig file and populate settings.               
            
1. Add npm packages for basic project dependencies and devDependencies. 

1. Configure nodemon to watch for files and restart server when code changes are detected. Also uses ts-node to monitor changes to TypeScript files and compile them on the fly rather than performing a build of the entire project when code changes. 

1. Add scripts to package.json for building/watching code.

1. Add src/server.ts file with console.log() output as a placeholder and means of testing project build tools/setup.

1. Add src/config module code, based on the 'convict' npm module for working with configuration files. Added sample config files for development, production, and test environments. 

1. Created repository on Github and pushed code up to github (https://github.com/bsmall/typescript-node-express-boilerplate).

1. Config module tweaked to remove unneeded 'env' parameter. Also enabled strict configuration file schema checking, requiring that a schema definition for all configuration parameters must exist in config.ts, and that the configuration files must pass validation when loaded (config file properties have valid values, properties aren't missing in the config files, config files do not contain properties not defined in config.ts, etc). 

    NOTE: When importing the config module, if a problem is encountered parsing the configuration file, an error is thrown by the config module, with error information logged to the console, and the Node process is ended using `process.exit(1)`. The error will not bubble up to the code that is importing the config module because an `import` statement cannot be contained within a try/catch block. 
    
1. Modified build script to copy configuration file to /dist/config folder for production.

1. Adds logger module that was built last year for another project. Utilizes the winston npm package to generate log output.

1. Modified build script to include /public folder in build output for static assets.

1. Implemented Express server with CORS, compression, disabled x-powered-by tag, logging to console and files, body-parser for json, method-override for clients that struggle with PUT/DELETE, and serving static content from folder.

1. Added configuration file items to configure server CORS options.

1. Added configuration file items to configure server compression options for responses.

1. Added configuration file items to configure server static content path. Only allowing a single path for now, though Express.static allows multiple paths, so this could be changed at a later date.


