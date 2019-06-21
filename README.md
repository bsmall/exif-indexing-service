# exif-indexing-service

This project runs as a service, processing messages from a Message Queue for image files that have been added, changed, or deleted. It extracts the EXIF data from the image file and adds it to an ElasticSearch database. 

## NPM commands

* `npm start` (same as `npm build:live`): Starts server in developer mode, watching for changes to code, compiling TypeScript on the fly using ts-node.
* `npm run start:production`: Starts server in production mode. Assumes code has already been build using `npm run build`.
* `npm run build`: Builds code and places it in the `/dist` folder.
* `npm run build:live`: Same as `npm start`.
* `test`: Runs tests. __`TODO: NOT IMPLEMENTED`__
     

## Project folder structure

`/dist` - Build output.

`/node_modules` - npm packages.

`/src` - Project source code.

`/src/config` - Configuration files and config module code.

`/src/logger` - Logging module. Based on winston npm module.

`/src/public` - Static assets served out by Express. Content in this folder appears at site root (e.g.: localhost:3000/file.txt). When running a build for production, same folder is copied to /dist/public.


